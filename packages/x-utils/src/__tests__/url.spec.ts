import { extractUrlParameters, getTaggingInfoFromUrl } from '../url';

describe('url utils methods tests', () => {
  it('should not break when dealing with bad urls', () => {
    const { url, params } = extractUrlParameters('null');
    expect(url).toBe('null');
    expect(params).toBe(undefined);

    expect(getTaggingInfoFromUrl('null')).toStrictEqual({
      url: 'null',
      params: { follow: false }
    });
  });

  it('should retrieve the url and the params', () => {
    const { url, params } = extractUrlParameters(
      'https://api.empathy.co/?q=chips&env=mobile&lang=english&lang=spanish'
    );
    expect(url).toBe('https://api.empathy.co/');
    expect(params).toStrictEqual({
      q: 'chips',
      env: 'mobile',
      lang: ['english', 'spanish']
    });
  });

  it('should retrieve the tagging info from the url', () => {
    const { url, params } = getTaggingInfoFromUrl(
      'https://api.empathy.co/?q=chips&env=mobile&lang=english&lang=spanish'
    );
    expect(url).toBe('https://api.empathy.co/');
    expect(params).toStrictEqual({
      q: 'chips',
      env: 'mobile',
      lang: ['english', 'spanish'],
      follow: false
    });
  });
});
