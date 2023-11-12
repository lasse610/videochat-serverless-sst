import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "src/context/socketContext/socketContext";

interface IncomingCallNotificationProps {
  children: React.ReactNode;
}

interface IncomingCallMessage {
  action: string;
  data: {
    customerName: string;
    room: string;
  };
}
// handles incoming calls from customers
// TODO: Reject call
export default function IncomingCallNotification({
  children,
}: IncomingCallNotificationProps) {
  const [visibility, setVisibility] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { socket, isConnected } = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    const originalSocket = socket.current;
    console.log("SHOULD REGISTER LISTENERS");
    console.log(isConnected);
    console.log(originalSocket);
    isConnected &&
      originalSocket &&
      originalSocket.addEventListener("message", handleCalls);
    return () => {
      originalSocket &&
        originalSocket.removeEventListener("message", handleCalls);
    };
  }, [socket, isConnected]);

  function handleCalls(event: MessageEvent<any>) {
    const data = JSON.parse(event.data) as IncomingCallMessage;
    console.log(data.action);
    switch (data.action) {
      case "incomingCall":
        setRoomName(data.data.room);
        setCustomerName(data.data.customerName);
        setVisibility(true);
        break;
      case "endCall":
        setRoomName("");
        setCustomerName("");
        setVisibility(false);
        break;
      default:
        console.log("unknown message received", data);
    }
  }

  function handleClick() {
    navigate(`/expertCall/${roomName}`);
  }
  return (
    <>
      {children}
      <Box
        sx={{
          display: visibility ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          left: 0,
          height: "300px",
          width: "100%",
        }}
      >
        <Box
          sx={{
            padding: "20px",
            width: "80%",
            height: "200px",
            borderTopStyle: "solid",
            borderTopColor: "primary.main",
            borderTopWidth: "5px",
            backgroundColor: "white",
            display: visibility ? "flex" : "none",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "30px" }}>
            Incoming call from {customerName}
          </Typography>

          <Button
            sx={{
              textTransform: "none",
              color: "green",
              borderStyle: "solid",
              borderColor: "green",
              borderWidth: "3px",
              borderRadius: "100px",
            }}
            onClick={handleClick}
          >
            Answer
          </Button>
        </Box>
      </Box>
    </>
  );
}
