import { REST_HOST } from '../host';

export class UserEndpoint {
  getPath(): string {
    return '/users';
  }

  post(username: string, password: string): Promise<string> {
    return fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }).then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      return response.text();
    });
  }
}
