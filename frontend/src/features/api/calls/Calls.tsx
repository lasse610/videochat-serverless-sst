import { Call } from "src/types";
import http from "../utils/http";

const endpoint = "/calls";

interface PostCallRequest {
  duration: number;
  customerName: string;
  customerPhoneNumber: string;
  latitude: number | undefined;
  longitude: number | undefined;
  reference: string;
  userId: string;
  callId: string;
  notes: string;
  userName: string;
}

async function getCallById(id: string | undefined) {
  if (id !== undefined) {
    return http.get<Call>(endpoint + "/" + id);
  }

  return;
}

async function getCalls() {
  return http.get<Call[]>(endpoint);
}

async function postCall(call: PostCallRequest) {
  return http.post(endpoint, call);
}

export { postCall, getCalls, getCallById };
