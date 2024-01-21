// This import is necessary for the type declarations below to work
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

interface CustomMatchers {
	stringsEqualIgnoreWhitespace: (other: string) => void;
}

declare module 'vitest' {
	interface Assertion extends CustomMatchers {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
