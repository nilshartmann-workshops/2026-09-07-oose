import "vitest";

interface CustomMatchers<R = unknown> {
  toBeZodSuccess(expected?: any): R;
  toBeZodFailure(
    expectedErrorMessage?: string | RegExp,
    path?: string | string[],
  ): R;
}

declare module "vitest" {
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
