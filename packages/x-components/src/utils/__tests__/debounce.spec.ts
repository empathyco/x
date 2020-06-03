import { debounce } from '../debounce';

describe('testing debounce util', () => {
  beforeAll(jest.useFakeTimers);

  it('returns a function with cancel method', () => {
    const returnedFn = debounce(() => null, 100);
    expect(typeof returnedFn).toEqual('function');
    expect(typeof returnedFn.cancel).toEqual('function');
  });

  it('returns a function that calls the received function with a specified debounce', () => {
    const originalFn = jest.fn();
    const returnedFn = debounce(originalFn, 100);
    returnedFn();
    jest.advanceTimersByTime(50);
    expect(originalFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(originalFn).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-len
  it('returns a function that calls the received function only once if the debounce time is not completed', () => {
    const originalFn = jest.fn();
    const returnedFn = debounce(originalFn, 100);
    returnedFn();
    jest.advanceTimersByTime(50);
    expect(originalFn).not.toHaveBeenCalled();
    returnedFn();
    returnedFn();
    jest.advanceTimersByTime(50);
    expect(originalFn).not.toHaveBeenCalled();
    returnedFn();
    jest.advanceTimersByTime(50);
    expect(originalFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(originalFn).toHaveBeenCalledTimes(1);
  });

  // eslint-disable-next-line max-len
  it('returns a function that calls the received function with the same parameters of the last call', () => {
    const originalFn = jest.fn();
    const returnedFn = debounce(originalFn, 100);
    const args1 = ['Test1', 1, { a: 'b' }];
    const args2 = ['Test2', 2, { c: 'd' }];
    returnedFn(...args1);
    jest.advanceTimersByTime(50);
    returnedFn(...args2);
    jest.advanceTimersByTime(100);
    expect(originalFn).toHaveBeenCalledTimes(1);
    expect(originalFn).toHaveBeenCalledWith(...args2);
  });

  // eslint-disable-next-line max-len
  it('does not call the received function if is canceled before the debounceTime is completed', () => {
    const originalFn = jest.fn();
    const returnedFn = debounce(originalFn, 100);
    returnedFn();
    jest.advanceTimersByTime(50);
    returnedFn();
    jest.advanceTimersByTime(50);
    returnedFn.cancel();
    jest.advanceTimersByTime(100);
    expect(originalFn).not.toHaveBeenCalled();
  });
});
