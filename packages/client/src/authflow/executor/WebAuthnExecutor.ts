import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import { type JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { WebAuthnLoginEndpoint } from '../../api/rest/WebAuthnLoginEndpoint';
import { WebAuthnRegisterEndpoint } from '../../api/rest/WebAuthnRegisterEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { WebAuthnRenderer } from '../renderer/WebAuthnRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class WebAuthnExecutor extends AbstractFlowExecutor<WebAuthnRenderer> {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(renderCallback, new WebAuthnRenderer());
  }

  async execute(): Promise<void> {
    this.renderCallback(this.renderer.renderInitial());
    // TODO open popup for registration or authentication
    const username: string | undefined = 'actualtest2';

    await this.registerStepListener();

    const loginToken = username
      ? await this.startRegisterFlow(username)
      : await this.startAuthenticationFlow();

    const docEndPoint = new DocumentEndpoint();
    const image = await docEndPoint.get(`Bearer ${loginToken}`);
    this.renderCallback(this.renderer.renderDocumentReceived(image));
  }

  private async startRegisterFlow(username: string) {
    const spy = await SpySession.get();
    const registerEndPoint = new WebAuthnRegisterEndpoint();

    this.renderCallback(this.renderer.renderLineFromClient(`GET ${registerEndPoint.getPath()}`));
    const { options, token } = await registerEndPoint.get(username, spy.sessionId);
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
    const loginToken = await registerEndPoint.post(token, credential, spy.sessionId);
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
