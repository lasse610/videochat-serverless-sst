import http from '../utils/http';
import axios from "axios";
import { Screenshot } from 'src/types';

const endpoint = '/screenshot';

export async function postScreenshotImage(uploadUrl: string, image: Blob) {
  
  
  return axios.put(
    uploadUrl,
    image
  );
}

export async function getScreenshotById(id: string) {
  return http.get(endpoint + id);
}

export async function deleteScreenshotById(id: string) {
  return http.delete(endpoint + id);
}

export async function updateScreenshotNotes(id: string, notes: string){
  return http.patch(`${endpoint}/${id}`, { notes })
}


interface RequestUploadUrlResponse {
  presignedUrl: string,
  key: string,
}

export async function requestUploadUrl(callId: string){
  return http.post<RequestUploadUrlResponse>(endpoint + "/requestUploadUrl", {callId})
}


export async function postScreenshotData(callId: string, filename: string) {
  const data = {
    callId,
    filename,
  };

  return http.post<Screenshot>(endpoint, data);
}


