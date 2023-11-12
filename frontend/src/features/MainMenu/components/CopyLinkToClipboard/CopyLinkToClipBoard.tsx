import React from "react";
import { SxProps, Typography, Box, Button } from "@mui/material";

interface CopyLinkToClipBoardProps {
  handleSubmit: () => Promise<string>;
  createLink: (id: string) => string;
  setInviteVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  buttonStyle: SxProps;
}

export default function CopyLinkToClipBoard({
  handleSubmit,
  createLink,
  setInviteVisibility,
  buttonStyle,
}: CopyLinkToClipBoardProps) {
  async function handleCopyToClipboard() {
    const id = await handleSubmit();
    console.log(id);
    await navigator.clipboard.writeText(createLink(id));

    setInviteVisibility((visibility) => !visibility);
  }

  return (
    <>
      <Typography sx={{ fontWeight: "bold" }}>Copy Link</Typography>

      <Typography sx={{ fontSize: "14px" }}>
        Create and copy the invite link to your clipboard by pressing the button
        below.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={handleCopyToClipboard} sx={buttonStyle}>
          Copy to Clipboard
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
