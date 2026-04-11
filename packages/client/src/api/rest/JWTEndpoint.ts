import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

export class JWTEndpoint {
  getPath(): string {
    return '/login/jwt';
  }

  getPostMessageData(auth: string, spySessionId: string): { headers: HeadersInit } {
    return {
      headers: {
        Authorization: auth,
        'Content-Type': 'text/plain',
        [SPY_SESSION_HEADER]: spySessionId,
      },
    };
  }

  post(headers: HeadersInit): Promise<string> {
    return fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: headers,
    }).then(async (response) => {
      if (!response.ok) {
        await throwResponseError(response);
      }
      return response.text();
    });
  }
}
