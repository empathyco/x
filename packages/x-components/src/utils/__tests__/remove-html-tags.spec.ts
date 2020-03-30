import { removeHTMLTags } from '../remove-html-tags';

describe('testing remove html tags function', () => {
  it('replaces "<" and ">" characters in a string to an empty character', () => {
    const str = '<abc>';
    const result = removeHTMLTags(str);
    expect(result).toBe('abc');
  });
});
