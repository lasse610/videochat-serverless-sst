import http from '../utils/http';

interface PostInviteResponse {
  id: string
}
const endpoint = '/invites';

async function getInviteById(id: string) {
  return http.get(`${endpoint}/${id}`);
}

async function getInvites() {
  return http.get(endpoint);
}

async function postInvite(
  customerName: string,
  reference: string,
  username: string,
  agentName: string,
) {
  const data = {
    username, 
    reference,
    customerName,
    agentName
  };
  console.log(data);
  return http.post<PostInviteResponse>(endpoint, data);
}

export { postInvite, getInviteById, getInvites };
