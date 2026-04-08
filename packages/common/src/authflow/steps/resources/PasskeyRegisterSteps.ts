import { ValidAuthSteps } from '../AuthSteps';

export type PasskeyRegisterSteps = ValidAuthSteps<{
  idk: {
    data: any;
  };
}>;

export const PasskeyRegisterStepKeys = ['idk'] as const satisfies (keyof PasskeyRegisterSteps)[];
