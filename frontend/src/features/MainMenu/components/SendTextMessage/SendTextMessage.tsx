import React from "react";
import axios from "axios";
import { TextField, SxProps, Box, Button } from "@mui/material";
import { sendTextMessage } from "src/features/api/textmessages/textmessages";

interface SendTextMessageProps {
  handleSubmit: () => Promise<string>;
  handleInputFieldChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => void;
  phoneNumber: string;
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  buttonStyle: SxProps;
}

export default function SendTextMessage({
  handleSubmit,
  handleInputFieldChange,
  phoneNumber,
  setInviteVisibility,
  buttonStyle,
}: SendTextMessageProps) {
  function checkPhoneNumber() {
    return (
      /^\d+$/.test(phoneNumber) &&
      phoneNumber.startsWith("358") &&
      phoneNumber.length === 12
    );
  }

  async function handleClick() {
    try {
      const id = await handleSubmit();
      await sendTextMessage(`/call/${id}`, phoneNumber);
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 400
      ) {
        console.log(error.message);
      }
    }
    setInviteVisibility((visibility) => !visibility);
  }

  return (
    <>
      <TextField
        value={phoneNumber}
        onChange={(e) =>
          handleInputFieldChange(
            e as React.ChangeEvent<HTMLInputElement>,
            "number"
          )
        }
        label="Mobile Phone Number "
        size="small"
        error={!checkPhoneNumber() && phoneNumber.length > 1}
        required
        helperText={!checkPhoneNumber() ? "Invalid Phone Number" : ""}
      />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          sx={buttonStyle}
          disabled={!checkPhoneNumber()}
          onClick={handleClick}
        >
          Send Message
        </Button>
        <Button
          sx={buttonStyle}
          onClick={() => setInviteVisibility((visibility) => !visibility)}
        >
          Cancel
        </Button>
      </Box>
    </>
  );
}
