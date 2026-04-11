import { SPY_SESSION_HEADER } from '@auth-visualizer/common';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

export class WebAuthnLoginEndpoint {
  getPath(): string {
    return '/login/webauthn';
  }

  async get(spySessionId: string) {
    const response = await fetch(REST_HOST + this.getPath(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', [SPY_SESSION_HEADER]: spySessionId },
    });
    if (!response.ok) {
      await throwResponseError(response);
    }
    return response.json() as Promise<{
      options: PublicKeyCredentialRequestOptionsJSON;
      token: string;
    }>;
  }

  getPostMessageData(token: string, credential: AuthenticationResponseJSON, spySessionId: string) {
    return {
      headers: { 'Content-Type': 'application/json', [SPY_SESSION_HEADER]: spySessionId },
      body: { token, response: credential },
    };
  }

  async post(headers: HeadersInit, body: any): Promise<string> {
    const registerResp = await fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!registerResp.ok) {
      await throwResponseError(registerResp);
    }
    return registerResp.text();
  }
}
