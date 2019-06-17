import { Tagging } from '@empathy/search-types';
import { EmpathyTaggingMapper } from '../../mappers/response/empathy-tagging.mapper';

const taggingMapper = new EmpathyTaggingMapper();

it('extracts parameters and endpoint adding the follow false parameter', () => {
  // tslint:disable-next-line:max-line-length
  const url = 'https://api.empathybroker.com/tagging/v1/track/juguettos/query?q=lego+star+wars&contextualizeEnabled=false&spellcheck=false&totalHits=72&catalog=default&origin=default&scope=desktop&store=default&page=1&lang=es&contextualizeApplied=none';

  const tagging = taggingMapper.map(url, {} as Tagging);

  expect(tagging.url).toEqual('https://api.empathybroker.com/tagging/v1/track/juguettos/query');
  expect(tagging.params).toEqual({
    q: 'lego star wars',
    contextualizeEnabled: 'false',
    spellcheck: 'false',
    totalHits: '72',
    catalog: 'default',
    origin: 'default',
    scope: 'desktop',
    store: 'default',
    page: '1',
    lang: 'es',
    contextualizeApplied: 'none',
    follow: false
  });
});
