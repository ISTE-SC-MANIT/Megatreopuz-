import { makeResolvable } from "../src/components/resolvablePromise";

describe("Resolvable promise", () => {
    it("Resolves with the given value", (done) => {
        expect.hasAssertions();

        const { promise, resolve } = makeResolvable<boolean>(() => {
            // Do nothing
        });
        resolve(true);
        promise.then((val) => {
            expect(val).toBe(true);
            done();
        });
    });

    it("Resolves naturally with the given value", (done) => {
        expect.hasAssertions();

        const { promise } = makeResolvable<boolean>((resolve) => {
            // Do nothing
            resolve(true);
        });
        promise.then((val) => {
            expect(val).toBe(true);
            done();
        });
    });

    it("Rejects naturally with the given reason", (done) => {
        expect.hasAssertions();

        const { promise } = makeResolvable<boolean>((_, reject) => {
            // Do nothing
            reject(true);
        });
        promise.catch((val) => {
            expect(val).toBe(true);
            done();
        });
    });
});
