import { SPY_SESSION_HEADER } from '@auth-visualizer/common';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/browser';

import { REST_HOST } from '../host';
import { throwResponseError } from '../util';

export class WebAuthnRegisterEndpoint {
  getPath(): string {
    return '/login/webauthn/register';
  }

  getGetMessageData(auth: string, spySessionId: string) {
    return {
      headers: {
        'Content-Type': 'application/json',
        [SPY_SESSION_HEADER]: spySessionId,
        Authorization: auth,
      },
    };
  }

  async get(headers: HeadersInit) {
    const response = await fetch(REST_HOST + this.getPath(), {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      await throwResponseError(response);
    }
    return response.json() as Promise<{
      options: PublicKeyCredentialCreationOptionsJSON;
      token: string;
    }>;
  }

  getPostMessageData(
    auth: string,
    token: string,
    credential: RegistrationResponseJSON,
    spySessionId: string,
  ) {
    return {
      headers: {
        'Content-Type': 'application/json',
        [SPY_SESSION_HEADER]: spySessionId,
        Authorization: auth,
      },
      body: JSON.stringify({ token, response: credential }),
    };
  }

  async post(headers: HeadersInit, body: string): Promise<string> {
    const registerResp = await fetch(REST_HOST + this.getPath(), {
      method: 'POST',
      headers,
      body,
    });
    if (!registerResp.ok) {
      await throwResponseError(registerResp);
    }
    return registerResp.text();
  }
}
