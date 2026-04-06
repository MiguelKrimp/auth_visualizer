import { StepInfo } from './StepInfo';

type ClientStepProps = {
  stepLabel: string;
  info?: Record<string, unknown> | undefined;
  x: string;
};

export function ClientStep({ stepLabel, info, x }: ClientStepProps) {
  return (
    <StepInfo
      stepLabel={stepLabel}
      info={info}
      stepStyle={{}}
      containerStyle={{ width: `calc(${x} - 1em)`, display: 'flex', justifyContent: 'flex-end' }}
    />
  );
}
