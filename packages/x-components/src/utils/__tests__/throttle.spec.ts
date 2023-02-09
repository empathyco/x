import { throttle } from '../throttle';

describe('testing throttle util', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  it('only invokes the throttled function once if it is called multiple times', () => {
    const originalFn = jest.fn();
    const throttledFunction = throttle(originalFn, 100);

    throttledFunction(1);
    throttledFunction(2);
    throttledFunction(3);
    jest.advanceTimersByTime(99);
    expect(originalFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(originalFn).toHaveBeenCalledTimes(1);
    expect(originalFn).toHaveBeenCalledWith(3);

    throttledFunction(4);
    jest.advanceTimersByTime(100);
    expect(originalFn).toHaveBeenCalledTimes(2);
    expect(originalFn).toHaveBeenLastCalledWith(4);
  });

  it('calls the function immediately when `leading=true`', () => {
    const originalFn = jest.fn();
    const throttledFunction = throttle(originalFn, 100, { leading: true });
    throttledFunction(1);

    expect(originalFn).toHaveBeenCalledTimes(1);
    expect(originalFn).toHaveBeenLastCalledWith(1);

    throttledFunction(2);
    throttledFunction(3);
    jest.advanceTimersByTime(99);
    expect(originalFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(originalFn).toHaveBeenCalledTimes(2);
    expect(originalFn).toHaveBeenLastCalledWith(3);

    // Calling the function again should be immediate as it has no pending timers
    throttledFunction(4);
    expect(originalFn).toHaveBeenCalledTimes(3);
    expect(originalFn).toHaveBeenLastCalledWith(4);

    jest.advanceTimersByTime(50);
    throttledFunction(5);
    throttledFunction(6);

    jest.advanceTimersByTime(49);
    expect(originalFn).toHaveBeenCalledTimes(3);

    jest.advanceTimersByTime(1);
    expect(originalFn).toHaveBeenCalledTimes(4);
    expect(originalFn).toHaveBeenLastCalledWith(6);
  });
});
