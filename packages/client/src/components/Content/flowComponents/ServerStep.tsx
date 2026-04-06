import { StepInfo } from './StepInfo';

type ServerStepProps = {
  stepLabel: string;
  info?: Record<string, unknown> | undefined;
  x: string;
};

export function ServerStep({ stepLabel, info, x }: ServerStepProps) {
  return (
    <StepInfo
      stepLabel={stepLabel}
      info={info}
      stepStyle={{ left: `calc(${x} + 1em)` }}
      containerStyle={{ width: '100%' }}
    />
  );
}
