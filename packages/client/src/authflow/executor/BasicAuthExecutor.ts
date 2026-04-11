import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class BasicAuthExecutor extends AbstractFlowExecutor<FlowRenderer> {
  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    super(new FlowRenderer(renderCallback));
  }

  async execute(): Promise<void> {
    this.renderer.renderInitial();

    const { username, password } = await this.renderer.renderLoginStart();
    const credentials = encodeBasicCredentials(username, password);
    const basicAuthHeader = `Basic ${credentials}`;

    const spy = await SpySession.get();
    await this.registerStepListener();

    const docEndPoint = new DocumentEndpoint();
    const getMessageData = docEndPoint.getGetMessageData(basicAuthHeader, spy.sessionId);
    this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`, getMessageData);
    const img = await docEndPoint.get(getMessageData.headers);
    this.renderer.renderLineFromServer('Image received', { img });

    this.renderer.renderDocumentReceived(img);
    this.renderer.renderSeparator('50px');
  }
}
