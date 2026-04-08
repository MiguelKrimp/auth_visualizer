import { ValidAuthSteps } from '../AuthSteps';

export type PasskeyLoginSteps = ValidAuthSteps<{
  idk: {
    data: any;
  };
}>;

export const PasskeyLoginStepKeys = ['idk'] as const satisfies (keyof PasskeyLoginSteps)[];
