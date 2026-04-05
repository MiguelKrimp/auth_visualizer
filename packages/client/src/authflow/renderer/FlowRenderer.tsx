import type { JSX } from 'react';

const leftX = '30%';
const rightX = '70%';

export class FlowRenderer {
  private elements: JSX.Element[] = [];

  renderInitial(): JSX.Element[] {
    const initialElements = [
      <image x={`calc(${leftX} - 20px)`} y={5} height={40} width={40} href="./desktop.svg" />,
      <line stroke="darkgreen" strokeWidth={5} x1={leftX} y1={50} x2={leftX} y2="99%" />,
      <image x={`calc(${rightX} - 20px)`} y={5} height={40} width={40} href="./server.svg" />,
      <line stroke="orange" strokeWidth={5} x1={rightX} y1={50} x2={rightX} y2="99%" />,
    ];

    this.elements.push(...initialElements);

    return this.elements;
  }
}
