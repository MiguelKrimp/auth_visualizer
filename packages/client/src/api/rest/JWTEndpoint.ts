import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { REST_HOST } from '../host';

export class JWTEndpoint {
  getPath(): string {
    return '/login/jwt';
  }

  post(auth: string, spySessionId: string): Promise<string> {
    return fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'text/plain',
        [SPY_SESSION_HEADER]: spySessionId,
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch JWT: ${response.statusText}`);
      }
      return response.text();
    });
  }
}
