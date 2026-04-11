import { FaMobileAlt, FaServer } from 'react-icons/fa';

import { WebAuthnLoginPopup } from '../../components/common/WebAuthnLoginPopup';
import { ClientStep } from '../../components/Content/flowComponents/ClientStep';
import { DeviceLine } from '../../components/Content/flowComponents/DeviceLine';
import { InteractableStep } from '../../components/Content/flowComponents/InteractableStep';
import { Separator } from '../../components/Content/flowComponents/Separator';
import { ServerStep } from '../../components/Content/flowComponents/ServerStep';
import { EventHandler } from '../../util/EventHandler';
import { FlowRenderer } from './FlowRenderer';

export class WebAuthnRenderer extends FlowRenderer {
  renderClientAndAuthenticator() {
    this.startNewContainer();
    this.addElements([
      <DeviceLine x={FlowRenderer.LEFTX} y="0px" color={FlowRenderer.CLIENT_COLOR} />,
      <DeviceLine
        x={FlowRenderer.THIRD_PARTYX}
        y="5px"
        color={FlowRenderer.THIRD_PARTY_COLOR}
        img={<FaMobileAlt size="1.5em" />}
        label="Authenticator"
      />,
      <Separator height="100px" />,
    ]);

    this.renderCallback(this.allElements);
  }

  async renderWebAuthnLoginPopup(): Promise<{ username: string; password: string } | undefined> {
    return new Promise<{ username: string; password: string } | undefined>((resolve) => {
      const eventHandler = new EventHandler<void>();
      this.addElements([
        <WebAuthnLoginPopup
          triggerComponent={
            <InteractableStep disableAfterInteraction eventHandler={eventHandler}>
              <ClientStep stepLabel="Login to get epic cat pics!" x={FlowRenderer.LEFTX} />
            </InteractableStep>
          }
          onConfirm={(cred) => {
            resolve(cred);
            eventHandler.emit();
          }}
        />,
      ]);

      this.renderCallback(this.allElements);
    });
  }

  renderAuthenticatorStep(text: string) {
    this.addElements([<ServerStep stepLabel={text} x={FlowRenderer.THIRD_PARTYX} />]);

    this.renderCallback(this.allElements);
  }

  renderSecondClientServer() {
    this.startNewContainer();
    this.addElements([
      <DeviceLine x={FlowRenderer.LEFTX} y="0px" color={FlowRenderer.CLIENT_COLOR} />,
      <DeviceLine
        x={FlowRenderer.RIGHTX}
        y="5px"
        color={FlowRenderer.SERVER_COLOR}
        img={<FaServer size="1.5em" />}
        label="Server"
      />,
      <Separator height="100px" />,
    ]);

    this.renderCallback(this.allElements);
  }

  renderLineFromClientToAuth(text: string, data: any): void {
    this.lastLineDestination = FlowRenderer.THIRD_PARTYX;
    return this.renderLine(FlowRenderer.CLIENT_COLOR, text, FlowRenderer.THIRD_PARTYX, data);
  }

  renderLineFromAuthToClient(text: string, data: any): void {
    this.lastLineDestination = undefined;
    return this.renderLine(FlowRenderer.THIRD_PARTY_COLOR, text, FlowRenderer.THIRD_PARTYX, data);
  }
}
