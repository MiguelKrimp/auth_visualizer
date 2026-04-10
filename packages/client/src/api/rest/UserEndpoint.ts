import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

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
    }).then(async (response) => {
      if (!response.ok) {
        await throwResponseError(response);
      }
      return response.text();
    });
  }
}
