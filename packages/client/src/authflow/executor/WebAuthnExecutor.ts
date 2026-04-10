import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { type JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { WebAuthnLoginEndpoint } from '../../api/rest/WebAuthnLoginEndpoint';
import { WebAuthnRegisterEndpoint } from '../../api/rest/WebAuthnRegisterEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { WebAuthnRenderer } from '../renderer/WebAuthnRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class WebAuthnExecutor extends AbstractFlowExecutor<WebAuthnRenderer> {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(renderCallback, new WebAuthnRenderer());
  }

  async execute(): Promise<void> {
    this.renderCallback(this.renderer.renderInitial());

    const credentials = await new Promise<{ username: string; password: string } | undefined>(
      (resolve) => {
        this.renderCallback(this.renderer.renderWebAuthnLoginPopup((cred) => resolve(cred)));
      },
    );

    await this.registerStepListener();

    const loginToken = credentials
      ? await this.startRegisterFlow(credentials)
      : await this.startAuthenticationFlow();

    this.renderCallback(this.renderer.renderSeparator('50px'));
    const docEndPoint = new DocumentEndpoint();
    this.renderCallback(this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`));
    const image = await docEndPoint.get(`Bearer ${loginToken}`);
    this.renderCallback(this.renderer.renderLineFromServer('Received Document'));

    this.renderCallback(this.renderer.renderDocumentReceived(image));
  }

  private async startRegisterFlow({ username, password }: { username: string; password: string }) {
    const spy = await SpySession.get();
    const registerEndPoint = new WebAuthnRegisterEndpoint();

    const auth = `Basic ${encodeBasicCredentials(username, password)}`;

    this.renderCallback(this.renderer.renderLineFromClient(`GET ${registerEndPoint.getPath()}`));
    const { options, token } = await registerEndPoint.get(auth, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received registration options'));
    this.renderCallback(this.renderer.renderSeparator('20px'));

    this.renderCallback(this.renderer.renderClientAndAuthenticator());
    this.renderCallback(this.renderer.renderLineFromClientToAuth('Call WebAuthn API'));
    this.renderCallback(this.renderer.renderAuthenticatorStep('Waiting for user interaction...'));
    const credential = await startRegistration({ optionsJSON: options });
    this.renderCallback(
      this.renderer.renderLineFromAuthToClient('Received credential from authenticator'),
    );
    this.renderCallback(this.renderer.renderSeparator('20px'));

    this.renderCallback(this.renderer.renderSecondClientServer());
    this.renderCallback(this.renderer.renderLineFromClient(`POST ${registerEndPoint.getPath()}`));
    const loginToken = await registerEndPoint.post(auth, token, credential, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received JWT for authentication'));

    return loginToken;
  }

  private async startAuthenticationFlow() {
    const spy = await SpySession.get();
    const loginEndPoint = new WebAuthnLoginEndpoint();

    this.renderCallback(this.renderer.renderLineFromClient(`GET ${loginEndPoint.getPath()}`));
    const { options, token } = await loginEndPoint.get(spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received authentication options'));
    this.renderCallback(this.renderer.renderSeparator('20px'));

    this.renderCallback(this.renderer.renderClientAndAuthenticator());
    this.renderCallback(this.renderer.renderLineFromClientToAuth('Call WebAuthn API'));
    this.renderCallback(this.renderer.renderAuthenticatorStep('Waiting for user interaction...'));
    const credential = await startAuthentication({ optionsJSON: options });
    this.renderCallback(this.renderer.renderLineFromAuthToClient('Authenticator signed challenge'));
    this.renderCallback(this.renderer.renderSeparator('20px'));

    this.renderCallback(this.renderer.renderSecondClientServer());
    this.renderCallback(this.renderer.renderLineFromClient(`POST ${loginEndPoint.getPath()}`));
    const loginToken = await loginEndPoint.post(token, credential, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received JWT for authentication'));

    return loginToken;
  }
}
