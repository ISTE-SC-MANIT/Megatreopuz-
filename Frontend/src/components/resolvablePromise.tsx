// Returning a promise that can be forced to resolved externally
// As per ES6 spec, extraneous resolution / rejection are safe
export interface ResolvablePromise<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
}

export function makeResolvable<T>(
    executor: (
        _resolve: (value?: T | PromiseLike<T>) => void,
        resolve: (reason?: any) => void
    ) => void
): ResolvablePromise<T> {
    let resolve: Parameters<typeof executor>[0];
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        new Promise(executor).then(_resolve).catch(_reject);
        executor;
    });
    return { promise, resolve };
}
