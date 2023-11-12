import { useEffect, useState } from "react";
import { InitializeSocketConnectionMessage } from "src/features/api/socket/socket";
import { useAppState } from "src/context/state";
import { Outlet } from "react-router-dom";
import React from "react";
import { useSocketContext } from "src/context/socketContext/socketContext";

export default function SocketConnection(props: { authenticated: boolean }) {
  const { authenticated } = props;
  const { socket, setIsConnected } = useSocketContext();
  const { user } = useAppState();
  const [waitingToReconnect, setWaitingToReconnect] = useState(false);
  const username = user?.username;
  useEffect(() => {
    if (waitingToReconnect) {
      return;
    }
    const websocket = new WebSocket(
      process.env.REACT_APP_WEBSOCKET_API_URL || "no url provided"
    );

    console.log("connecting");
    if (authenticated) {
      websocket.addEventListener("open", () => {
        setIsConnected(true);
        const message: InitializeSocketConnectionMessage = {
          action: "initialize",
          data: { username: username || "not logged in" },
        };
        websocket.send(JSON.stringify(message));
      });
    }

    websocket.addEventListener("close", () => {
      if (socket.current) {
        console.log("connection closed by server");
      } else {
        //Cleanup initiated app side can return here
        console.log("ws closed by app component unmount");
        return;
      }

      setIsConnected(false);
      setWaitingToReconnect(true);
      setTimeout(() => setWaitingToReconnect(false), 5000);
    });

    console.log(websocket);
    socket.current = websocket;
    return () => {
      setIsConnected(false);
      socket.current = undefined;
      websocket.close();
    };
  }, [username, authenticated, socket, setIsConnected, waitingToReconnect]);

  return <Outlet />;
}
