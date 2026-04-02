import { BasicAuthStepKeys } from '../steps/authenticators/BasicAuthSteps';
import { UniqueStringTuple } from '../steps/AuthSteps';

const BasicAuthFlow = [...BasicAuthStepKeys] as const;

type BasicAuthFlow = UniqueStringTuple<typeof BasicAuthFlow>;

export const BasicAuthFlowSteps = BasicAuthFlow;
