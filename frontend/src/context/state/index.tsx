import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser, RoomType } from "../../types";
import { TwilioError } from "twilio-video";
import { Amplify, Auth, Hub } from "aws-amplify";
import useActiveSinkId from "./useActiveSinkId/useActiveSinkId";
import { CognitoUser } from "@aws-amplify/auth";
import { CognitoUserSession } from "amazon-cognito-identity-js";
import { HubCallback } from "@aws-amplify/core/lib/Hub";

export interface StateContextType {
  user: null | IUser;
  login(username: string, password: string): Promise<CognitoUser>;
  logout(): Promise<any>;
  error: TwilioError | Error | null;
  setError(error: TwilioError | Error | null): void;
  getToken(
    name: string,
    room: string
  ): Promise<{ room_type: RoomType; token: string }>;
  isFetching: boolean;
  activeSinkId: string;

  setActiveSinkId(sinkId: string): void;
  roomType?: RoomType;
  token: string;
}

export const StateContext = createContext<StateContextType>(null!);

export default function AppStateProvider(props: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<TwilioError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [activeSinkId, setActiveSinkId] = useActiveSinkId();
  const [roomType, setRoomType] = useState<RoomType>();

  Amplify.configure({
    Auth: {
      // Amazon Cognito Identity Pool ID
      identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,

      // Amazon Cognito Region
      region: process.env.REACT_APP_REGION,

      // Amazon Cognito User Pool ID
      userPoolId: process.env.REACT_APP_USER_POOL_ID,

      // Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    },
  });

  const login = (username: string, password: string): Promise<CognitoUser> =>
    Auth.signIn(username, password);

  const logout = (): Promise<any> => Auth.signOut();

  const getSession = (): Promise<CognitoUserSession | null> =>
    Auth.currentSession();

  const useCognito = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const authListener: HubCallback = ({ payload: { event, data } }) => {
      console.log("here");
      console.log(JSON.stringify(data?.attributes));
      switch (event) {
        case "signIn":
          setUser({
            name: data.attributes?.name,
            username: data.username,
            token: data.signInUserSession.accessToken,
          });
          break;
        case "signOut":
          setUser(null);
          break;
      }
    };

    useEffect(() => {
      getSession()
        .then((session) => {
          if (session && session.isValid()) {
            Auth.currentUserInfo().then((user: any) => {
              console.log(user);
              setUser({
                name: user.attributes?.name,
                username: user.username,
                token: session.getAccessToken(),
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, []);

    useEffect(() => {
      Hub.listen("auth", authListener);
      return () => Hub.remove("auth", authListener);
    }, []);

    return { user, login, logout };
  };

  let contextValue = {
    error,
    setError,
    isFetching,
    activeSinkId,
    setActiveSinkId,
    roomType,
  } as StateContextType;

  contextValue = {
    ...contextValue,
    getToken: async (userIdentity, roomName) => {
      const endpoint = `${process.env.REACT_APP_API_URL}/token`;

      return fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userIdentity,
          roomName,
        }),
      }).then((res) => res.json());
    },
  };

  const getToken: StateContextType["getToken"] = (name, room) => {
    setIsFetching(true);
    return contextValue
      .getToken(name, room)
      .then((res) => {
        setRoomType(res.room_type);
        setIsFetching(false);
        return res;
      })
      .catch((err) => {
        setError(err);
        setIsFetching(false);
        return Promise.reject(err);
      });
  };
  const auth = useCognito();
  return (
    <StateContext.Provider value={{ ...auth, ...contextValue, getToken }}>
      {props.children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppStateProvider");
  }
  return context;
}
