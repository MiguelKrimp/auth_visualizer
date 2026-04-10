import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

export class DocumentEndpoint {
  getPath(): string {
    return '/documents/catpics';
  }

  get(auth: string, spySessionId?: string): Promise<string> {
    const headers: HeadersInit = {
      Authorization: auth,
      'Content-Type': 'text/plain',
    };
    if (spySessionId) {
      headers[SPY_SESSION_HEADER] = spySessionId;
    }

    return fetch(REST_HOST + this.getPath(), {
      method: 'GET',
      headers: headers,
    }).then(async (response) => {
      if (!response.ok) {
        await throwResponseError(response);
      }
      return response.text();
    });
  }

  post(auth: string, label: string, dataUrl: string): Promise<void> {
    return fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataUrl, label }),
    }).then(async (response) => {
      if (!response.ok) {
        await throwResponseError(response);
      }
    });
  }
}
