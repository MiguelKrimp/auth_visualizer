import { BasicAuthStepKeys } from '../steps/authenticators/BasicAuthSteps';
import { JWTAuthStepKeys } from '../steps/authenticators/JwtAuthSteps';
import { UniqueStringTuple } from '../steps/AuthSteps';
import { JwtIssueStepKeys } from '../steps/resources/JwtIssueSteps';

const SimpleJWTFlow = [...BasicAuthStepKeys, ...JwtIssueStepKeys, ...JWTAuthStepKeys] as const;

type SimpleJWTFlow = UniqueStringTuple<typeof SimpleJWTFlow>;

export const SimpleJWTFlowSteps = SimpleJWTFlow;
