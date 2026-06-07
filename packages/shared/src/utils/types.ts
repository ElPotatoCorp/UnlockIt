export type Simplify<T> = { [K in keyof T]: T[K] } & {};

export type UnwrapPromises<T> = {
  [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K];
};

type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];

export type NullToOptional<T> = Simplify<
  { [K in NonNullableKeys<T>]: T[K] } & 
  { [K in NullableKeys<T>]?: Exclude<T[K], null> }
>;