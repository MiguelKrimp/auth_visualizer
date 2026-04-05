import { BasicAuthStepKeys } from './authenticators/BasicAuthSteps';
import { JWTAuthStepKeys } from './authenticators/JwtAuthSteps';
import { JwtIssueStepKeys } from './resources/JwtIssueSteps';

export type StepIDs =
  | (typeof BasicAuthStepKeys)[number]
  | (typeof JWTAuthStepKeys)[number]
  | (typeof JwtIssueStepKeys)[number];
