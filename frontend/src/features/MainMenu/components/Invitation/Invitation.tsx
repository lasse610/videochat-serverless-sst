import React, { useState } from "react";
import { Box, Typography, TextField, Tab, Tabs, SxProps } from "@mui/material";
import { v4 } from "uuid";
import axios from "axios";
import { postInvite } from "src/features/api/invites/Invites";
import { useAppState } from "src/context/state";
import CopyLinkToClipBoard from "../CopyLinkToClipboard/CopyLinkToClipBoard";
import SendTextMessage from "../SendTextMessage/SendTextMessage";

interface InvitationProps {
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Invitation({ setInviteVisibility }: InvitationProps) {
  const { user } = useAppState();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [reference, setReference] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  function createLink(id: string) {
    const url = window.location.origin;
    return `${url}/call/${id}`;
  }

  async function handleSubmit() {
    let id = "";
    if (!customerName || !user) return id;

    try {
      const res = await postInvite(
        customerName,
        reference,
        user.username,
        user.name || "no name provided"
      );
      if (!res.data.id) {
        throw new Error("No id returned from server");
      }
      id = res.data.id;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        console.log(error.message);
      }
    }
    setCustomerName("");
    setReference("");
    return id;
  }

  function handleInputFieldChange(
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) {
    const { value } = event.target;
    switch (true) {
      case field === "name":
        setCustomerName(value);
        break;
      case field === "reference":
        setReference(value);
        break;
      case field === "number":
        setPhoneNumber(value);
        break;
    }
  }

  function handleChange(event: React.SyntheticEvent, newValue: number) {
    setSelectedTab(newValue);
  }

  function preventPropagation(event: React.SyntheticEvent) {
    event.stopPropagation();
  }

  const buttonStyle: SxProps = {
    backgroundColor: "primary.main",
    color: "white",
    textTransform: "none",
    paddingX: "20px",
    borderRadius: "100px",
    borderStyle: "solid",
    borderWidth: "2px",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "white",
      borderColor: "primary.main",
      color: "primary.main",
    },
  };

  return (
    <Box
      onClick={preventPropagation}
      sx={{
        backgroundColor: "white",
        width: "400px",
        height: "450px",
        padding: "25px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Typography sx={{ fontWeight: "bold" }}>
          Create an Invitation
        </Typography>
        <TextField
          value={customerName}
          label="Name"
          required
          size="small"
          sx={{ borderRadius: "0px" }}
          onChange={(e) =>
            handleInputFieldChange(
              e as React.ChangeEvent<HTMLInputElement>,
              "name"
            )
          }
        />
        <TextField
          value={reference}
          label="Reference"
          size="small"
          onChange={(e) =>
            handleInputFieldChange(
              e as React.ChangeEvent<HTMLInputElement>,
              "reference"
            )
          }
        />

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          sx={{ alignSelf: "center" }}
        >
          <Tab label="Send SMS" sx={{ textTransform: "none" }} />
          <Tab label="Copy & Paste Link" sx={{ textTransform: "none" }} />
        </Tabs>
        {selectedTab ? (
          <CopyLinkToClipBoard
            handleSubmit={handleSubmit}
            setInviteVisibility={setInviteVisibility}
            createLink={createLink}
            buttonStyle={buttonStyle}
          />
        ) : (
          <SendTextMessage
            handleSubmit={handleSubmit}
            handleInputFieldChange={handleInputFieldChange}
            phoneNumber={phoneNumber}
            setInviteVisibility={setInviteVisibility}
            buttonStyle={buttonStyle}
          />
        )}
      </Box>
    </Box>
  );
}
