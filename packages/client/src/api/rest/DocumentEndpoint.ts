import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { HOST } from '../host';

export class DocumentEndpoint {
  getPath(): string {
    return '/documents';
  }

  get(auth: string, spySessionId: string): Promise<string> {
    return fetch(HOST + this.getPath(), {
      method: 'GET',
      headers: {
        Authorization: auth,
        [SPY_SESSION_HEADER]: spySessionId,
        'Content-Type': 'text/plain',
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }
      return response.text();
    });
  }

  post(auth: string, dataUrl: string): Promise<void> {
    return fetch(HOST + this.getPath(), {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dataUrl }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.statusText}`);
      }
    });
  }
}
