import type { JSX } from 'react';
import { FaDesktop, FaServer } from 'react-icons/fa';

import { BasicLoginPopup } from '../../components/common/BasicLoginPopup';
import { ImageDialog } from '../../components/common/ImageDialog';
import { ClientStep } from '../../components/Content/flowComponents/ClientStep';
import { CommunicationLine } from '../../components/Content/flowComponents/CommunicationLine';
import { DeviceLine } from '../../components/Content/flowComponents/DeviceLine';
import { InteractableStep } from '../../components/Content/flowComponents/InteractableStep';
import { Separator } from '../../components/Content/flowComponents/Separator';
import { ServerStep } from '../../components/Content/flowComponents/ServerStep';
import { EventHandler } from '../../util/EventHandler';
import { AuthPartiesContainer } from './AuthPartiesContainer';

export class FlowRenderer {
  static readonly LEFTX = '20%';
  static readonly RIGHTX = '50%';
  static readonly THIRD_PARTYX = '70%';
  static readonly CLIENT_COLOR = 'bright';
  static readonly SERVER_COLOR = 'accent2';
  static readonly THIRD_PARTY_COLOR = 'accent1';

  private containers: AuthPartiesContainer[] = [];

  protected currentContainer?: AuthPartiesContainer;

  startNewContainer() {
    this.currentContainer = new AuthPartiesContainer();
    this.containers.push(this.currentContainer);
  }

  protected addElements(elements: JSX.Element[]) {
    if (!this.currentContainer) {
      this.startNewContainer();
    }
    this.currentContainer?.addElements(elements);
  }

  protected get allElements() {
    return [...this.containers.map((c) => c.render())];
  }

  renderInitial(): JSX.Element[] {
    this.addElements([
      <DeviceLine
        x={FlowRenderer.LEFTX}
        y="5px"
        color={FlowRenderer.CLIENT_COLOR}
        img={<FaDesktop size="1.5em" />}
        label="Client"
      />,
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

  renderSeparator(height: string): JSX.Element[] {
    this.addElements([<Separator height={height} />]);

    return this.allElements;
  }

  renderLoginStart(callback: (username: string, password: string) => void): JSX.Element[] {
    const eventHandler = new EventHandler<void>();
    this.addElements([
      <BasicLoginPopup
        triggerComponent={
          <InteractableStep disableAfterInteraction eventHandler={eventHandler}>
            <ClientStep stepLabel="Login to get epic cat pics!" x={FlowRenderer.LEFTX} />
          </InteractableStep>
        }
        onConfirm={(username, password) => {
          callback(username, password);
          eventHandler.emit();
        }}
      />,
    ]);

    return [...this.allElements];
  }

  renderDocumentReceived(imageDataUrl: string): JSX.Element[] {
    this.addElements([
      <ImageDialog
        triggerComponent={
          <InteractableStep>
            <ClientStep stepLabel="Open the cat pics!" x={FlowRenderer.LEFTX} />
          </InteractableStep>
        }
        imageDataUrl={imageDataUrl}
      />,
    ]);

    return [...this.allElements];
  }

  renderStepInfoClient(
    stepLabel: string,
    info?: Record<string, unknown>,
    callback?: () => void,
  ): JSX.Element[] {
    const step = <ClientStep stepLabel={stepLabel} info={info} x={FlowRenderer.LEFTX} />;

    if (callback) {
      this.addElements([
        <InteractableStep disableAfterInteraction click={callback}>
          {step}
        </InteractableStep>,
      ]);
    } else {
      this.addElements([step]);
    }

    return [...this.allElements];
  }

  renderStepInfoServer(stepLabel: string, info?: Record<string, unknown>): JSX.Element[] {
    this.addElements([<ServerStep stepLabel={stepLabel} info={info} x={FlowRenderer.RIGHTX} />]);

    return [...this.allElements];
  }

  renderLine(color: string, text: string): JSX.Element[] {
    this.addElements([
      <CommunicationLine
        x1={FlowRenderer.LEFTX}
        x2={`calc(100% - ${FlowRenderer.RIGHTX})`}
        color={color}
        text={text}
      />,
    ]);

    return [...this.allElements];
  }

  renderLineFromClient(text: string): JSX.Element[] {
    return this.renderLine(FlowRenderer.CLIENT_COLOR, text);
  }

  renderLineFromServer(text: string): JSX.Element[] {
    return this.renderLine(FlowRenderer.SERVER_COLOR, text);
  }
}
