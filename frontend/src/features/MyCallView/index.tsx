import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import CallInfoSection from "./components/CallInfoSection/CallInfoSection";
import MediaGallery from "./components/MediaGallery/MediaGallery";
import { Call, Screenshot } from "src/types";
import { getCallById } from "../api/calls/Calls";
import SelectedCallsOverlay from "./components/SelectedCallsOverlay/SelectedCallsOverlay";

export default function MyCall() {
  const navigate = useNavigate();
  const [call, setCall] = useState<Call>();
  const [selectedScreenshots, setSelectedScreenshots] = useState<Screenshot[]>(
    []
  );
  const { callID } = useParams();
  useEffect(() => {
    async function fetchCall() {
      try {
        const res = await getCallById(callID);
        setCall(res?.data);
      } catch (error) {
        navigate("/mycalls");
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 400
        ) {
          console.log(error);
        }
      }
    }
    if (callID) {
      fetchCall();
    }
  }, [callID, navigate]);

  return (
    <Box sx={{ padding: { xs: "5px", sm: "20px" } }}>
      {call ? (
        <>
          <CallInfoSection call={call} />
          <MediaGallery
            selectedScreenshots={selectedScreenshots}
            setSelectedScreenshots={setSelectedScreenshots}
            screenshots={call?.screenshots ?? []}
          />
        </>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={100} />
        </Box>
      )}
      {selectedScreenshots.length > 0 && call && (
        <SelectedCallsOverlay
          call={call}
          setCall={setCall}
          callID={callID as string}
          setSelectedScreenshots={setSelectedScreenshots}
          selectedScreenshots={selectedScreenshots}
        />
      )}
    </Box>
  );
}
