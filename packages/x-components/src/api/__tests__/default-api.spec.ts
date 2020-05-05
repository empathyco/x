import { bus } from '../../plugins/x-bus';
import { BaseXAPI } from '../base-api';

describe('testing default X API', () => {
  const defaultXAPI = new BaseXAPI();
  const query = 'maserati';

  it('should emit `UserAcceptedAQuery` through the `search` function', () => {
    const listener = jest.fn();
    bus.on('UserAcceptedAQuery').subscribe(listener);

    defaultXAPI.search(query);

    expect(listener).toHaveBeenCalledWith(query);
  });
});
