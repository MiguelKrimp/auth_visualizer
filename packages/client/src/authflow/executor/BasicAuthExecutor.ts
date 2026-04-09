import type { JSX } from 'react';

import { DocumentEndpoint } from '../../api/rest/DocumentEndpoint';
import { SpySession } from '../../api/spySession/SpySession';
import { encodeBasicCredentials } from '../../util/EncodingUtil';
import { FlowRenderer } from '../renderer/FlowRenderer';
import { AbstractFlowExecutor } from './AbstractFlowExecutor';

export class BasicAuthExecutor extends AbstractFlowExecutor {
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
    const basicAuthHeader = `Basic ${credentials}`;

    await this.registerStepListener();

    const docEndPoint = new DocumentEndpoint();

    this.renderCallback(this.renderer.renderLineFromClient(`GET ${docEndPoint.getPath()}`));
    const img = await docEndPoint.get(basicAuthHeader, spy.sessionId);
    this.renderCallback(this.renderer.renderLineFromServer(''));

    this.renderCallback(this.renderer.renderDocumentReceived(img));
    this.renderCallback(this.renderer.renderSeparator('50px'));
  }
}
