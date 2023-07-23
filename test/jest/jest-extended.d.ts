import '@types/jest';

declare global {
	namespace jest {
		interface Matchers<R> {
			stringsEqualIgnoreWhitespace(text: string): R;
		}
	}
}
