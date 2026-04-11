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
    super(new WebAuthnRenderer(renderCallback));
  }

  async execute(): Promise<void> {
    this.renderer.renderInitial();

    const credentials = await this.renderer.renderWebAuthnLoginPopup();

    await this.registerStepListener();

    const loginToken = credentials
      ? await this.startRegisterFlow(credentials)
      : await this.startAuthenticationFlow();

    this.renderer.renderSeparator('50px');

    const docEndPoint = new DocumentEndpoint();
    const getData = docEndPoint.getGetMessageData(`Bearer ${loginToken}`);
    this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`, getData);
    const image = await docEndPoint.get(getData.headers);
    this.renderer.renderLineFromServer('Image received', { image });

    this.renderer.renderDocumentReceived(image);
  }

  private async startRegisterFlow({ username, password }: { username: string; password: string }) {
    const spy = await SpySession.get();

    const auth = `Basic ${encodeBasicCredentials(username, password)}`;

    const registerEndPoint = new WebAuthnRegisterEndpoint();
    const getData = registerEndPoint.getGetMessageData(auth, spy.sessionId);
    this.renderer.renderLineFromClient(`GET ${registerEndPoint.getPath()}`, getData);
    const { options, token } = await registerEndPoint.get(getData.headers);
    this.renderer.renderLineFromServer('Received registration options', { options, token });

    this.renderer.renderSeparator('20px');

    this.renderer.renderClientAndAuthenticator();
    this.renderer.renderLineFromClientToAuth('Call WebAuthn API', { options });
    this.renderer.renderAuthenticatorStep('Waiting for user interaction...');
    const credential = await startRegistration({ optionsJSON: options });
    this.renderer.renderLineFromAuthToClient('Received credential from authenticator', {
      credential,
    });

    this.renderer.renderSeparator('20px');

    this.renderer.renderSecondClientServer();
    const postData = registerEndPoint.getPostMessageData(auth, token, credential, spy.sessionId);
    this.renderer.renderLineFromClient(`POST ${registerEndPoint.getPath()}`, postData);
    const loginToken = await registerEndPoint.post(postData.headers, postData.body);
    this.renderer.renderLineFromServer('Received JWT for authentication', { jwt: loginToken });

    return loginToken;
  }

  private async startAuthenticationFlow() {
    const spy = await SpySession.get();

    const loginEndPoint = new WebAuthnLoginEndpoint();
    this.renderer.renderLineFromClient(`GET ${loginEndPoint.getPath()}`, undefined);
    const { options, token } = await loginEndPoint.get(spy.sessionId);
    this.renderer.renderLineFromServer('Received authentication options', { options, token });

    this.renderer.renderSeparator('20px');

    this.renderer.renderClientAndAuthenticator();
    this.renderer.renderLineFromClientToAuth('Call WebAuthn API', { options });
    this.renderer.renderAuthenticatorStep('Waiting for user interaction...');
    const credential = await startAuthentication({ optionsJSON: options });
    this.renderer.renderLineFromAuthToClient('Authenticator signed challenge', { credential });

    this.renderer.renderSeparator('20px');

    this.renderer.renderSecondClientServer();
    const postData = loginEndPoint.getPostMessageData(token, credential, spy.sessionId);
    this.renderer.renderLineFromClient(`POST ${loginEndPoint.getPath()}`, postData);
    const loginToken = await loginEndPoint.post(postData.headers, postData.body);
    this.renderer.renderLineFromServer('Received JWT for authentication', { jwt: loginToken });

    return loginToken;
  }
}
