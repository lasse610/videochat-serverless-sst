import {
  LocalVideoTrack,
  RemoteVideoTrack,
  TwilioError,
  LocalTrackPublication,
  RemoteTrackPublication,
} from 'twilio-video';

  
  import {CognitoAccessToken} from "amazon-cognito-identity-js";

declare module 'twilio-video' {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
}

declare global {

  interface visualViewport extends VisualViewport {
    scale: number;
  }

  interface Window {
    visualViwport: visualViewport
  }

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export type DataTrackMessage = {
  type: string;
  event: string;
  drawStyle?: string;
  info?: CanvasMouseEvent;
  blob?: string;
  location?: { latitude: number; longitude: number };
  screenshot?: Screenshot;
  presignedUrl?: string
  key?: string
};



export type Screenshot = {
  dateCreated: string;
  filename: string;
  id: string;
  notes?: string;
  callId: string;
  serialnumbers: string[];
  url: string;
};


export type CanvasMouseEvent = {
  pointer: { x: number; y: number };
  width: number;
  height: number;
};

export type TrackPublication = LocalTrackPublication | RemoteTrackPublication;

export type TestImage = {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export interface IUser {
  name: string | undefined;
  username: string;
  token: CognitoAccessToken;
}

export type Invite = {
  answered: boolean,
  customer_name: string,
  reference: string,
  date_created: string,
  time_to_live: number,
  id: string,
  user_id: string,
  agent_name: string
};

export type Call = {
  notes: string;
  id: string;
  dateCreated: string;
  duration: number;
  customerName: string;
  customerPhoneNumber: string;
  reference: string;
  screenshots?: Screenshot[];
  latitude: string;
  longitude: string;
  userId: string
  userName: string
};
