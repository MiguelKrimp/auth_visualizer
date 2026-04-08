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

const leftX = '20%';
const rightX = '50%';

const clientColor = 'bright';
const serverColor = 'accent2';

export class FlowRenderer {
  private elements: JSX.Element[] = [];

  renderInitial(): JSX.Element[] {
    this.elements = [
      <DeviceLine
        x={leftX}
        y="5px"
        color={clientColor}
        img={<FaDesktop size="1.5em" />}
        label="Client"
      />,
      <DeviceLine
        x={rightX}
        y="5px"
        color={serverColor}
        img={<FaServer size="1.5em" />}
        label="Server"
      />,
      <Separator height="100px" />,
    ];

    return [...this.elements];
  }

  renderSeparator(height: string): JSX.Element[] {
    this.elements.push(<Separator height={height} />);

    return [...this.elements];
  }

  renderLoginStart(callback: (username: string, password: string) => void): JSX.Element[] {
    const eventHandler = new EventHandler<void>();
    this.elements.push(
      <BasicLoginPopup
        triggerComponent={
          <InteractableStep disableAfterInteraction eventHandler={eventHandler}>
            <ClientStep stepLabel="Login to get epic cat pics!" x={leftX} />
          </InteractableStep>
        }
        onConfirm={(username, password) => {
          callback(username, password);
          eventHandler.emit();
        }}
      />,
    );

    return [...this.elements];
  }

  renderDocumentReceived(imageDataUrl: string): JSX.Element[] {
    this.elements.push(
      <ImageDialog
        triggerComponent={
          <InteractableStep>
            <ClientStep stepLabel="Open the cat pics!" x={leftX} />
          </InteractableStep>
        }
        imageDataUrl={imageDataUrl}
      />,
    );

    return [...this.elements];
  }

  renderStepInfoClient(
    stepLabel: string,
    info?: Record<string, unknown>,
    callback?: () => void,
  ): JSX.Element[] {
    const step = <ClientStep stepLabel={stepLabel} info={info} x={leftX} />;

    if (callback) {
      this.elements.push(
        <InteractableStep disableAfterInteraction click={callback}>
          {step}
        </InteractableStep>,
      );
    } else {
      this.elements.push(step);
    }

    return [...this.elements];
  }

  renderStepInfoServer(stepLabel: string, info?: Record<string, unknown>): JSX.Element[] {
    this.elements.push(<ServerStep stepLabel={stepLabel} info={info} x={rightX} />);

    return [...this.elements];
  }

  private renderLine(color: string, text: string): JSX.Element[] {
    this.elements.push(
      <CommunicationLine x1={leftX} x2={`calc(100% - ${rightX})`} color={color} text={text} />,
    );

    return [...this.elements];
  }

  renderLineFromClient(text: string): JSX.Element[] {
    return this.renderLine(clientColor, text);
  }

  renderLineFromServer(text: string): JSX.Element[] {
    return this.renderLine(serverColor, text);
  }
}
