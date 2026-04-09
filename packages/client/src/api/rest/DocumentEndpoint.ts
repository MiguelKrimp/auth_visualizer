import { SPY_SESSION_HEADER } from '@auth-visualizer/common';

import { REST_HOST } from '../host';

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
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
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
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to upload document: ${response.statusText}`);
      }
    });
  }
}
