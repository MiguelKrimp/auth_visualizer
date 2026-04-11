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
  protected renderCallback: (elements: JSX.Element[]) => void;

  static readonly LEFTX = '20%';
  static readonly RIGHTX = '50%';
  static readonly THIRD_PARTYX = '70%';
  static readonly CLIENT_COLOR = 'bright';
  static readonly SERVER_COLOR = 'accent2';
  static readonly THIRD_PARTY_COLOR = 'accent1';

  private containers: AuthPartiesContainer[] = [];
  protected currentContainer?: AuthPartiesContainer;

  protected lastLineDestination?: string;

  constructor(renderCallback: (elements: JSX.Element[]) => void) {
    this.renderCallback = renderCallback;
  }

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

  renderInitial(): void {
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

    this.renderCallback(this.allElements);
  }

  renderSeparator(height: string): void {
    this.addElements([<Separator height={height} />]);

    this.renderCallback(this.allElements);
  }

  async renderLoginStart(): Promise<{ username: string; password: string }> {
    return new Promise<{ username: string; password: string }>((resolve) => {
      const eventHandler = new EventHandler<void>();
      this.addElements([
        <BasicLoginPopup
          triggerComponent={
            <InteractableStep disableAfterInteraction eventHandler={eventHandler}>
              <ClientStep stepLabel="Login to get epic cat pics!" x={FlowRenderer.LEFTX} />
            </InteractableStep>
          }
          onConfirm={(username, password) => {
            resolve({ username, password });
            eventHandler.emit();
          }}
        />,
      ]);

      this.renderCallback(this.allElements);
    });
  }

  renderDocumentReceived(imageDataUrl: string): void {
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

    this.renderCallback(this.allElements);
  }

  renderStepInfoClient(
    stepLabel: string,
    info?: Record<string, unknown>,
    callback?: () => void,
  ): void {
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

    this.renderCallback(this.allElements);
  }

  renderStepInfoServer(stepLabel: string, info?: Record<string, unknown>): void {
    this.addElements([<ServerStep stepLabel={stepLabel} info={info} x={FlowRenderer.RIGHTX} />]);

    this.renderCallback(this.allElements);
  }

  protected renderLine(color: string, text: string, x2: string, data: any): void {
    this.addElements([
      <CommunicationLine
        x1={FlowRenderer.LEFTX}
        x2={`calc(100% - ${x2})`}
        color={color}
        text={text}
        msgData={data}
      />,
    ]);

    this.renderCallback(this.allElements);
  }

  renderErrorLine(text: string, data: any): void {
    this.renderLine('red.500', text, this.lastLineDestination ?? FlowRenderer.RIGHTX, data);
  }

  renderLineFromClient(text: string, data: any): void {
    this.lastLineDestination = FlowRenderer.RIGHTX;
    return this.renderLine(FlowRenderer.CLIENT_COLOR, text, FlowRenderer.RIGHTX, data);
  }

  renderLineFromServer(text: string, data: any): void {
    this.lastLineDestination = FlowRenderer.LEFTX;
    return this.renderLine(FlowRenderer.SERVER_COLOR, text, FlowRenderer.LEFTX, data);
  }
}
