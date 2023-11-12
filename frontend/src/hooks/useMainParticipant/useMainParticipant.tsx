import useVideoContext from '../useVideoContext/useVideoContext';
import useParticipants from '../useParticipants/useParticipants';
import { LocalParticipant, RemoteParticipant } from 'twilio-video';

export default function useMainParticipant():
  | RemoteParticipant
  | LocalParticipant {
  const participants = useParticipants();
  const { room } = useVideoContext();
  const localParticipant = room?.localParticipant;

  // The participant that is returned is displayed in the main video area. Changing the order of the following
  // variables will change the how the main speaker is determined.
  return participants[0] || localParticipant;
}
