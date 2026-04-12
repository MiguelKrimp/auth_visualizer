import {
  AuthenticationResponseJSON,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  RegistrationResponseJSON,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

import { EnvironmentVars } from '../Environment';

export class PasskeyService {
  private static instance: PasskeyService;
  public static getInstance(): PasskeyService {
    if (!PasskeyService.instance) {
      PasskeyService.instance = new PasskeyService();
    }
    return PasskeyService.instance;
  }

  private rpName = 'Auth Visualizer';
  private rpID = EnvironmentVars.hostname;
  private constructor() {}

  async createRegistrationOptions(username: string) {
    const registrationOptions = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpID,
      attestationType: 'direct',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
      userName: username,
      userID: Buffer.from(username),
    });

    return registrationOptions;
  }

  async verifyRegistration(challenge: string, attestationResponse: RegistrationResponseJSON) {
    return await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge: challenge,
      expectedOrigin: EnvironmentVars.clientOrigin,
      expectedRPID: this.rpID,
    });
  }

  async createAuthenticationOptions() {
    return await generateAuthenticationOptions({
      rpID: this.rpID,
    });
  }

  async verifyAuthentication(
    challenge: string,
    prevCounter: number,
    publicKey: Uint8Array<ArrayBuffer>,
    passkeyId: string,
    assertionResponse: AuthenticationResponseJSON,
  ) {
    return await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedRPID: this.rpID,
      expectedChallenge: challenge,
      expectedOrigin: EnvironmentVars.clientOrigin,
      credential: {
        publicKey,
        id: passkeyId,
        counter: prevCounter,
      },
    });
  }
}
