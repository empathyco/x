import { Container } from 'inversify';
import '../../__mocks__/fetch.mock';
import { FetchHttpClient } from '../../http-clients/fetch-http-client';
import { HttpClient } from '../../http-clients/http-client.model';

const container = new Container();
describe('Fetch HTTP Client', () => {
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = container.resolve(FetchHttpClient);
    container.snapshot();
  });

  afterEach(() => {
    container.restore();
  });

  it('creates well formed and valid URLs', () => {
    return httpClient.get('https://api.empathy.co/search', {
      q: 'shirt',
      filter: ['long sleeve', 'dotted', 'white'],
      rows: 12
    }).then(() => {
      expect(window.fetch)
        .toHaveBeenCalledWith('https://api.empathy.co/search?q=shirt&filter=long+sleeve&filter=dotted&filter=white&rows=12');
    });
  });

  it('cancels equal endpoint requests if no requestId parameter is passed', () => {

  });

  it('does not cancel equal endpoint requests if requestId parameter is passed', () => {

  });
});
