import type { JSX } from 'react';

import { SpySession } from '../../api/spySession/SpySession';
import type { FlowRenderer } from '../renderer/FlowRenderer';

export abstract class AbstractFlowExecutor {
  protected renderer: FlowRenderer;
  protected renderCallback: (elements: JSX.Element[]) => void;

  private resumeFnc?: (resume: boolean) => void;

  constructor(renderCallback: (elements: JSX.Element[]) => void, renderer: FlowRenderer) {
    this.renderCallback = renderCallback;
    this.renderer = renderer;
  }

  abstract execute(): Promise<void>;

  async pause(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.resumeFnc = resolve;
    });
  }

  async next(): Promise<void> {
    if (this.resumeFnc) {
      this.resumeFnc(true);
    } else {
      const spy = await SpySession.get();
      spy.resume();
    }
  }

  async abort(): Promise<void> {
    if (this.resumeFnc) {
      this.resumeFnc(false);
    } else {
      const spy = await SpySession.get();
      spy.abort();
    }
  }
}
