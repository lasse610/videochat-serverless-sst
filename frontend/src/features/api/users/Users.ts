import http from '../utils/http';

const apiUrl = 'api/users/';

export function register(username: string, password: string, name: string) {
  return http.post(apiUrl, {
    username: username,
    password: password,
    name: name,
  });
}
