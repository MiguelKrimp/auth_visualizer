import type { JSX } from 'react';

import { SpySession } from '../../api/spySession/SpySession';
import type { FlowRenderer } from '../renderer/FlowRenderer';

export abstract class AbstractFlowExecutor<Renderer extends FlowRenderer = FlowRenderer> {
  protected renderer: Renderer;
  protected renderCallback: (elements: JSX.Element[]) => void;

  private resumeFnc: ((resume: boolean) => void) | undefined;

  constructor(renderCallback: (elements: JSX.Element[]) => void, renderer: Renderer) {
    this.renderCallback = renderCallback;
    this.renderer = renderer;
  }

  protected async registerStepListener(): Promise<void> {
    const spy = await SpySession.get();
    spy.onPause((stepLabel, info) => {
      this.renderCallback(this.renderer.renderStepInfoServer(stepLabel, info));
    });
  }

  start(): Promise<void> {
    return this.execute().catch((e) => {
      this.renderCallback(
        this.renderer.renderLine('red.500', e instanceof Error ? e.message : String(e)),
      );
      this.renderCallback(this.renderer.renderSeparator('50px'));
      throw e;
    });
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
      this.resumeFnc = undefined;
    } else {
      const spy = await SpySession.get();
      spy.resume();
    }
  }

  async abort(): Promise<void> {
    if (this.resumeFnc) {
      this.resumeFnc(false);
      this.resumeFnc = undefined;
    }

    const spy = await SpySession.get();
    spy.abort();
  }
}
