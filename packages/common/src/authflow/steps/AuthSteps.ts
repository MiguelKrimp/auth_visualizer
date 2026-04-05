export type AuthStep<T> = {
  data: T;
};

export type ValidAuthSteps<T = Record<PropertyKey, AuthStep<any>>> =
  T extends Record<PropertyKey, AuthStep<any>> ? T : never;
