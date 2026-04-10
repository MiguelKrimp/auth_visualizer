import { SPY_SESSION_HEADER } from '@auth-visualizer/common';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';

import { REST_HOST } from '../host';

export class WebAuthnRegisterEndpoint {
  getPath(): string {
    return '/login/webauthn/register';
  }

  async get(auth: string, spySessionId: string) {
    const response = await fetch(REST_HOST + this.getPath(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        [SPY_SESSION_HEADER]: spySessionId,
        Authorization: auth,
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to get registration options: ${response.statusText}`);
    }
    return response.json() as Promise<{
      options: PublicKeyCredentialCreationOptionsJSON;
      token: string;
    }>;
  }

  async post(
    auth: string,
    token: string,
    credential: RegistrationResponseJSON,
    spySessionId: string,
  ): Promise<string> {
    const registerResp = await fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [SPY_SESSION_HEADER]: spySessionId,
        Authorization: auth,
      },
      body: JSON.stringify({ token, response: credential }),
    });
    return registerResp.text();
  }
}
