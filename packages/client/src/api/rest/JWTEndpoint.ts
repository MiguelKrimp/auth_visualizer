import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

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
    }).then(async (response) => {
      if (!response.ok) {
        await throwResponseError(response);
      }
      return response.text();
    });
  }
}
