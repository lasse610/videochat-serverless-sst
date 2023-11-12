import React, { useState } from "react";
import { Box } from "@mui/material";
import InviteOverlay from "./components/InviteOverlay/InviteOverlay";
import BottomContainer from "./components/BottomContainer/BottomoContainer";
import TopContainer from "./components/TopContainer/TopContainer";
import { Outlet } from "react-router-dom";

export default function MainMenu() {
  const [inviteVisibility, setInviteVisibility] = useState(false);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ width: { xs: "0%", sm: "15%" }, minWidth: { sm: "150px" } }}>
          <Box
            sx={{
              backgroundImage: "linear-gradient(#0A357A,#08439B,#072759)",
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              width: "15%",
              minWidth: "150px",
              position: "fixed",
              top: 0,
              left: 0,
            }}
          >
            <TopContainer
              inviteVisibility={inviteVisibility}
              setInviteVisibility={setInviteVisibility}
            />
            <BottomContainer />
          </Box>
        </Box>
        <Box sx={{ width: "85%" }}>{<Outlet />}</Box>
      </Box>
      <InviteOverlay
        inviteVisibility={inviteVisibility}
        setInviteVisibility={setInviteVisibility}
      />
    </>
  );
}
