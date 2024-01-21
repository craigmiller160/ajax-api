import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

interface CustomMatchers<R = unknown> {
	stringsEqualIgnoreWhitespace: (other: string) => void;
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
