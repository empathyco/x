import { getURLParameter } from '../get-url-parameters';

describe('testing get url params', () => {
  const url = 'http://localhost:8080/?param=test&param2=&param3=testing';
  Object.defineProperty(window, 'location', {
    writable: true,
    value: new URL(url)
  });
  it('gets an existing param from the URL', () => {
    const param = getURLParameter('param');
    expect(param).toBe('test');
  });

  it('gets null if the parameter does not exist', () => {
    const param = getURLParameter('config');
    expect(param).toBeNull();
  });

  it('gets null if the parameter exists but without value', () => {
    const param = getURLParameter('param2');
    expect(param).toBeNull();
  });
});
