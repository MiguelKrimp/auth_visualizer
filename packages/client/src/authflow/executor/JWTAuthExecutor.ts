import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { JWTEndpoint } from '../../api/rest/JWTEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class JWTAuthExecutor extends AbstractFlowExecutor<FlowRenderer> {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(new FlowRenderer(renderCallback));
  }

  async execute(): Promise<void> {
    this.renderer.renderInitial();

    const { username, password } = await this.renderer.renderLoginStart();
    const credentials = encodeBasicCredentials(username, password);
    const authHeader = `Basic ${credentials}`;

    const spy = await SpySession.get();
    await this.registerStepListener();

    const jwtEndPoint = new JWTEndpoint();
    const postMessageData = jwtEndPoint.getPostMessageData(authHeader, spy.sessionId);
    this.renderer.renderLineFromClient(`POST ${jwtEndPoint.getPath()}`, postMessageData);
    const jwt = await jwtEndPoint.post(postMessageData.headers);
    this.renderer.renderLineFromServer('Received JWT', { jwt });

    this.renderer.renderStepInfoClient('Using JWT for authentication');
    await this.pause();

    await this.getDocumentLoop(jwt, spy.sessionId);

    this.renderer.renderSeparator('50px');
  }

  async getDocumentLoop(jwt: string, spySessionId: string): Promise<void> {
    const docEndPoint = new DocumentEndpoint();
    const getMessageData = docEndPoint.getGetMessageData(`Bearer ${jwt}`, spySessionId);
    this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`, getMessageData);
    const image = await docEndPoint.get(getMessageData.headers);
    this.renderer.renderLineFromServer('Image received', { image });

    this.renderer.renderDocumentReceived(image);
    return new Promise((resolve) => {
      this.renderer.renderStepInfoClient('Got more cat pics?', undefined, async () => {
        await this.getDocumentLoop(jwt, spySessionId);
        resolve();
      });
    });
  }
}
