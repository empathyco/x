import { RequestError } from '../request-error';

describe('requestError testing', () => {
  it('should create an error with the message and response passed', () => {
    expect(() => {
      throw new RequestError('Request failed', {} as Response);
    }).toThrowError(RequestError);
  });
});
