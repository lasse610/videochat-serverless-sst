import http from '../utils/http';

const apiUrl = 'api/textmessage/';

export function sendTextMessage(link: string, phoneNumber: string) {
  return http.post(apiUrl, {
    link,
    phoneNumber,
  });
}
