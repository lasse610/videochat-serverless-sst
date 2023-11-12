import http from '../utils/http';
import axios from "axios";


const endpoint = '/videos';

interface VideoFragmentUploadResponse {
    presignedUrl: string
}

export enum VideoFragmentUploadAction{
    Upload = "upload",
    Finnish = "finnish"
}

export async function requestVideoFragmentUploadUrl(action: VideoFragmentUploadAction,  callId: string){
    return http.post<VideoFragmentUploadResponse>(endpoint, {callId, action})
}

export async function uploadVideoFragment(url: string, blob: Blob){
    
    axios.put(url, blob, {headers: {"Content-Type": "application/octet-stream"}})
}

export async function uploadFinnishPart(url: string){
    axios.put(url, "video upload finished");
}
