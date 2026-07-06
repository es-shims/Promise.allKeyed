export {};

declare global {
	interface PromiseConstructor {
		/**
		 * An ES-spec-compliant `Promise.allKeyed`, based on the await-dictionary proposal.
		 *
		 * Awaits every enumerable own property value of `promises`, and fulfills with a null-prototype
		 * object of the same keys mapped to their resolved values. Rejects as soon as any input rejects.
		 *
		 * @param promises - A dictionary whose enumerable own property values are awaited.
		 * @returns A promise for an object of the same keys mapped to their resolved values.
		 */
		allKeyed<T extends object>(promises: T): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
	}
}
