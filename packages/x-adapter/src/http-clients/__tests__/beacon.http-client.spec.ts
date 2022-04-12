import { HttpClient, RequestOptions } from '../../types/http-client.types';
import { koFetchMock, okFetchMock } from '../__mocks__/fetch.mock';

describe('beaconHttpClient testing', () => {
  const endpoint = 'https://api.empathy.co/tag/query';
  const requestOptions: Omit<RequestOptions, 'endpoint'> = {
    parameters: {
      q: 'shirt',
      filter: ['long sleeve', 'dotted', 'white'],
      rows: 12
    }
  };
  const mockedSendBeacon = jest.fn();
  navigator.sendBeacon = mockedSendBeacon;

  let beaconHttpClient: HttpClient;

  beforeEach(async () => {
    // This is required to reset the local state of the beacon.http-client module, as the hasAdBlock
    // variable needs to be reset between each test case iteration.
    beaconHttpClient = (await import('../beacon.http-client')).beaconHttpClient;
    window.fetch = okFetchMock as any;
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('sends a beacon when no ad-blocker is present', async () => {
    await beaconHttpClient(endpoint, requestOptions);
    expect(window.fetch).toHaveBeenCalledTimes(1);
    expect(mockedSendBeacon).toHaveBeenCalledTimes(1);
    expect(mockedSendBeacon).toHaveBeenCalledWith(
      `${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`
    );
  });

  it('uses the fetch API when an ad-blocker is present', async () => {
    window.fetch = koFetchMock as any;
    await beaconHttpClient(endpoint, requestOptions);
    expect(mockedSendBeacon).not.toHaveBeenCalled();
    expect(window.fetch as jest.Mock).toHaveBeenCalledTimes(2);
    expect(window.fetch as jest.Mock).toHaveBeenNthCalledWith(
      2,
      `${endpoint}?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12`,
      undefined
    );
  });
});
