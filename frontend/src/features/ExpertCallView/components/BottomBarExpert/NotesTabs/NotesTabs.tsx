import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

import Note from '../Note/Note';
import { Screenshot } from 'src/types';
import Screenshots from '../Screenshots/Screenshots';

interface NotesTabsProps {
  notes: string;
  screenshots: Screenshot[];
  screenshotNotes: string[];
  setScreenshotNotes: React.Dispatch<React.SetStateAction<string[]>>;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

export default function NotesTabs(props: NotesTabsProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const {
    screenshots,
    screenshotNotes,
    setScreenshotNotes,
    setNotes,
    notes,
  } = props;
  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', zIndex: 100 }}>
        <Tabs value={selectedTab} onChange={handleChange}>
          <Tab label="Notes" />
          <Tab label="Screenshots" />
        </Tabs>
      </Box>
      <Box sx={{ position: 'relative', height: '80%' }}>
        {selectedTab === 0 && <Note notes={notes} setNotes={setNotes} />}
        {selectedTab === 1 && (
          <Screenshots
            screenshots={screenshots}
            screenshotNotes={screenshotNotes}
            setScreenshotNotes={setScreenshotNotes}
          />
        )}
      </Box>
    </>
  );
}
