// Simplify
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

// Exact
type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type ExactData<Interface, Class extends Interface> = 
  [NonFunctionKeys<Class>] extends [NonFunctionKeys<Interface>] 
    ? true 
    : "Error: The class has extra fields not in schema";

// Nullable to Optional
type NullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? K : never;
}[keyof T];

type NonNullableKeys<T> = {
  [K in keyof T]: null extends T[K] ? never : K;
}[keyof T];

export type NullToOptional<T> = 
  { [K in NonNullableKeys<T>]: T[K] } & 
  { [K in NullableKeys<T>]?: Exclude<T[K], null> };