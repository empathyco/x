import { extractUrlParameters } from '../url';

describe('url utils methods tests', () => {
  it('should retrieve the url and the params', () => {
    const { url, params } = extractUrlParameters(
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
