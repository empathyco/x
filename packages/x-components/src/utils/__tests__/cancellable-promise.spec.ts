import { cancellablePromise } from '../cancellable-promise';

describe(`testing ${cancellablePromise.name} utility method`, () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it("resolves with the original promise if it's not cancelled", async () => {
    const originalPromiseTimeout = 1000;
    const originalPromisePayload = Math.random();
    const originalPromise = new Promise(res => {
      setTimeout(res, originalPromiseTimeout, originalPromisePayload);
    });
    const { promise } = cancellablePromise(originalPromise);
    jest.advanceTimersByTime(originalPromiseTimeout);
    await expect(promise).resolves.toBe(originalPromisePayload);
  });

  it('cancels the original promise with a rejection payload', async () => {
    const originalPromiseTimeout = 1000;
    const rejectPromisePayload = Math.random();
    const originalPromise = new Promise(res => {
      setTimeout(res, originalPromiseTimeout);
    });
    const { promise, cancel } = cancellablePromise(originalPromise);
    cancel(rejectPromisePayload);
    await expect(promise).rejects.toBe(rejectPromisePayload);
  });
});
