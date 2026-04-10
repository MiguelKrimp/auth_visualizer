import type { JSX } from 'react';
import { FaMobileAlt, FaServer } from 'react-icons/fa';

import { WebAuthnLoginPopup } from '../../components/common/WebAuthnLoginPopup';
import { ClientStep } from '../../components/Content/flowComponents/ClientStep';
import { CommunicationLine } from '../../components/Content/flowComponents/CommunicationLine';
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

    return this.allElements;
  }

  renderWebAuthnLoginPopup(callback: (username?: string) => void) {
    const eventHandler = new EventHandler<void>();
    this.addElements([
      <WebAuthnLoginPopup
        triggerComponent={
          <InteractableStep disableAfterInteraction eventHandler={eventHandler}>
            <ClientStep stepLabel="Login to get epic cat pics!" x={FlowRenderer.LEFTX} />
          </InteractableStep>
        }
        onConfirm={(username) => {
          callback(username);
          eventHandler.emit();
        }}
      />,
    ]);

    return [...this.allElements];
  }

  renderAuthenticatorStep(text: string) {
    this.addElements([<ServerStep stepLabel={text} x={FlowRenderer.THIRD_PARTYX} />]);

    return [...this.allElements];
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

    return this.allElements;
  }

  private renderThirdPartyLine(color: string, text: string) {
    this.addElements([
      <CommunicationLine
        x1={FlowRenderer.LEFTX}
        x2={`calc(100% - ${FlowRenderer.THIRD_PARTYX})`}
        color={color}
        text={text}
      />,
    ]);

    return [...this.allElements];
  }

  renderLineFromClientToAuth(text: string): JSX.Element[] {
    return this.renderThirdPartyLine(FlowRenderer.CLIENT_COLOR, text);
  }

  renderLineFromAuthToClient(text: string): JSX.Element[] {
    return this.renderThirdPartyLine(FlowRenderer.THIRD_PARTY_COLOR, text);
  }
}
