import type { JSX } from 'react';
import { FaDesktop, FaServer } from 'react-icons/fa';

import { CommunicationLine } from '../../components/Content/flowComponents/CommunicationLine';
import { DeviceLine } from '../../components/Content/flowComponents/DeviceLine';
import { Separator } from '../../components/Content/flowComponents/Separator';
import { StepInfo } from '../../components/Content/flowComponents/StepInfo';

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

  renderStepInfoClient(stepLabel: string, info: Record<string, unknown>): JSX.Element[] {
    this.elements.push(
      <StepInfo stepLabel={stepLabel} info={info} style={{ right: `calc(${leftX} - 1em)` }} />,
    );

    return [...this.elements];
  }

  renderStepInfoServer(stepLabel: string, info: Record<string, unknown>): JSX.Element[] {
    this.elements.push(
      <StepInfo stepLabel={stepLabel} info={info} style={{ left: `calc(${rightX} + 1em)` }} />,
    );

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
