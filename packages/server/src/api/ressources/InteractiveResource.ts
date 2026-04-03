import { ValidAuthSteps } from '@auth-visualizer/common/authflow/steps/AuthSteps';

import { Handler, HandlerWithSpySession, SpySessionBroker } from '../spySession/SpySessionBroker';
import { SecuredResource } from './SecuredResource';

export abstract class InteractiveResource<T extends ValidAuthSteps> extends SecuredResource {
  protected injectSpySession<H extends HandlerWithSpySession<T>>(handler: H): Handler<H> {
    return SpySessionBroker.getInstance().injectSpySession(handler);
  }
}
