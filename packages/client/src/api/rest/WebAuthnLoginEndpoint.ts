import { SPY_SESSION_HEADER } from '@auth-visualizer/common';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';

import { REST_HOST } from '../host';

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
      throw new Error(`Failed to get login options: ${response.statusText}`);
    }
    return response.json() as Promise<{
      options: PublicKeyCredentialRequestOptionsJSON;
      token: string;
    }>;
  }

  async post(
    token: string,
    credential: AuthenticationResponseJSON,
    spySessionId: string,
  ): Promise<string> {
    const registerResp = await fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', [SPY_SESSION_HEADER]: spySessionId },
      body: JSON.stringify({ token, response: credential }),
    });
    return registerResp.text();
  }
}
