import { Screenshot } from "./screenshots";

export interface Call {
    notes: string;
    id: string;
    dateCreated: string;
    duration: number;
    customerName: string;
    customerPhoneNumber: string;
    reference: string;
    screenshots?: Screenshot[];
    latitude: number;
    longitude: number;
    userId: string
    userName: string
}

export interface GetCallById extends Call {}; 