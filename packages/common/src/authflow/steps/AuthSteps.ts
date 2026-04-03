export type AuthStep<T> = {
  label: string;
  data: T;
};

export type ValidAuthSteps<T = Record<PropertyKey, AuthStep<any>>> =
  T extends Record<PropertyKey, AuthStep<any>> ? T : never;

type UniqueStringTupleInternal<
  T extends readonly string[],
  Seen extends string = never,
> = T extends readonly [infer Head extends string, ...infer Tail extends readonly string[]]
  ? Head extends Seen
    ? never
    : UniqueStringTupleInternal<Tail, Seen | Head>
  : T;

export type UniqueStringTuple<T extends readonly string[]> =
  UniqueStringTupleInternal<T> extends never ? never : T;

export const uniqueStringTuple = <const T extends readonly string[]>(
  values: UniqueStringTuple<T>,
): T => values;
