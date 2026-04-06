import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { JWTEndpoint } from '../../api/rest/JWTEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class JWTAuthExecutor extends AbstractFlowExecutor {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(renderCallback, new FlowRenderer());
  }

  async execute(): Promise<void> {
    this.renderCallback(this.renderer.renderInitial());

    const { username, password } = await new Promise<{ username: string; password: string }>(
      (resolve) => {
        this.renderCallback(
          this.renderer.renderLoginStart((username, password) => {
            resolve({ username, password });
          }),
        );
      },
    );

    const spy = await SpySession.get();

    const credentials = encodeBasicCredentials(username, password);
    const authHeader = `Basic ${credentials}`;

    spy.onPause((stepLabel, info) => {
      this.renderCallback(this.renderer.renderStepInfoServer(stepLabel, info));
    });

    const jwtEndPoint = new JWTEndpoint();

    this.renderCallback(this.renderer.renderLineFromClient(`POST ${jwtEndPoint.getPath()}`));
    const jwt = await jwtEndPoint.post(authHeader, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received JWT'));

    this.renderCallback(this.renderer.renderStepInfoClient('Using JWT for authentication'));
    await this.pause();

    await this.getDocumentLoop(jwt, spy.sessionId);

    this.renderCallback(this.renderer.renderSeparator('50px'));
  }

  async getDocumentLoop(jwt: string, spySessionId: string): Promise<void> {
    const docEndPoint = new DocumentEndpoint();
    this.renderCallback(this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`));
    const image = await docEndPoint.get(`Bearer ${jwt}`, spySessionId);
    this.renderCallback(this.renderer.renderLineFromServer('Received Document'));

    this.renderCallback(this.renderer.renderDocumentReceived(image));

    this.renderCallback(
      this.renderer.renderStepInfoClient(
        'Got more cat pics?',
        undefined,
        this.getDocumentLoop.bind(this, jwt, spySessionId),
      ),
    );
  }
}
