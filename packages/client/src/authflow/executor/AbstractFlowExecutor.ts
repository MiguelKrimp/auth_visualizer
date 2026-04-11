import { SpySession } from '../../api/spySession/SpySession';
import { ResponseError } from '../../api/util';
import type { FlowRenderer } from '../renderer/FlowRenderer';

export abstract class AbstractFlowExecutor<Renderer extends FlowRenderer = FlowRenderer> {
  protected renderer: Renderer;

  private resumeFnc: ((resume: boolean) => void) | undefined;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  protected async registerStepListener(): Promise<void> {
    const spy = await SpySession.get();
    spy.onPause((stepLabel, info) => {
      this.renderer.renderStepInfoServer(stepLabel, info);
    });
  }

  start(): Promise<void> {
    return this.execute().catch((e) => {
      const msg = e instanceof Error ? e.message : String(e);
      const data = e instanceof ResponseError ? e.detailMsg : undefined;
      this.renderer.renderErrorLine(msg, data);
      this.renderer.renderSeparator('50px');
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
