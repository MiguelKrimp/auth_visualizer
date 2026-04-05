import { HOST } from '../host';

export class JWTEndpoint {
  getPath(): string {
    return '/login/jwt';
  }

  post(auth: string): Promise<string> {
    return fetch(HOST + this.getPath(), {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'text/plain',
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JWT: ${response.statusText}`);
      }
      return response.text();
    });
  }
}
