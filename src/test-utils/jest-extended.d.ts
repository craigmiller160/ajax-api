declare global {
	namespace jest {
		interface Matchers<R> {
			stringsEqualIgnoreWhitespace(text: string): R;
		}

		interface JestMatchers<R> {
			stringsEqualIgnoreWhitespace(text: string): R;
		}
	}
}
