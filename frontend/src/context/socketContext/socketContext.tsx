import React, {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
  useState,
} from "react";

export interface SocketContextType {
  socket: MutableRefObject<WebSocket | undefined>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SocketContext = createContext<SocketContextType>(null!);

export default function SocketContextProvider(
  props: React.PropsWithChildren<{}>
) {
  const socket = useRef<WebSocket>();
  const [isConnected, setIsConnected] = useState(false);

  return (
    <SocketContext.Provider value={{ setIsConnected, isConnected, socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within the SocketContextProvider"
    );
  }
  return context;
}
