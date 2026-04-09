import type { BasicAuthSteps } from './authenticators/BasicAuthSteps';
import type { JWTAuthSteps } from './authenticators/JwtAuthSteps';
import type { JwtIssueSteps } from './resources/JwtIssueSteps';
import type { PasskeyLoginSteps } from './resources/PasskeyLoginSteps';
import type { PasskeyRegisterSteps } from './resources/PasskeyRegisterSteps';

export type StepIDs =
  | keyof BasicAuthSteps
  | keyof JWTAuthSteps
  | keyof JwtIssueSteps
  | keyof PasskeyLoginSteps
  | keyof PasskeyRegisterSteps;
