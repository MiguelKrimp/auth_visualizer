import { LuInfo } from 'react-icons/lu';

import type { AuthFlow } from '../../authflow/AuthFlow';
import { Tooltip } from '../common/Tooltip';

type AuthflowContentProps = {
  flow: AuthFlow;
};

export function Tab({ flow }: AuthflowContentProps) {
  return (
    <>
      {flow.label}
      <div style={{ position: 'absolute', right: 10 }}>
        <Tooltip
          content={
            <div>
              <span>{flow.description}</span>
              <a
                href={flow.infoLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#66d9ef', marginLeft: 4 }}
              >
                Learn more
              </a>
            </div>
          }
        >
          <LuInfo />
        </Tooltip>
      </div>
    </>
  );
}
