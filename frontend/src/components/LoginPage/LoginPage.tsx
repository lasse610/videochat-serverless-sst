import React from "react";
import { Box } from "@mui/material";
import { Authenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router-dom";
import { useAppState } from "src/context/state";

export default function LoginPage() {
  const { user } = useAppState();

  if (user) {
    return <Navigate to={"/mycalls/"} />;
  }

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(#008CFF,#00BDFF,#23E5E5)",
        width: "100%",
        overflow: "hidden",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Authenticator />
    </Box>
  );
}
