/**
 * An ES-spec-compliant `Promise.allKeyed` shim, based on the await-dictionary proposal.
 *
 * Awaits every enumerable own property value of `promises`, and fulfills with a null-prototype
 * object of the same keys mapped to their resolved values. Rejects as soon as any input rejects.
 *
 * @param promises - A dictionary whose enumerable own property values are awaited.
 * @returns A promise for an object of the same keys mapped to their resolved values.
 */
declare function allKeyed<
	C extends PromiseConstructor,
	K extends string | symbol,
	T,
>(
	this: C,
	promises: { [k in K]: Promise<T> | T },
): Promise<{ [k in K]: T }>;

export = allKeyed;
