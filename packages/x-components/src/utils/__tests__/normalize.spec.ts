describe('testing string normalization', () => {
  describe('when browser supports `String#normalize`', () => {
    let normalizeString: (string: string | undefined) => string;
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      normalizeString = require('../normalize').normalizeString;
    });

    it('removes special characters lowercasing them and trimming the string', () => {
      expect(normalizeString('  àáâäãåā ÀÁÂÄÃÅĀ   ')).toEqual('aaaaaaa aaaaaaa');
      expect(normalizeString('èéêëēėę ÈÉÊËĒĖĘ')).toEqual('eeeeeee eeeeeee');
      expect(normalizeString('îïíīįì ÎÏÍĪĮÌ')).toEqual('iiiiii iiiiii');
      expect(normalizeString('ôöòóōõ ÔÖÒÓŌÕ')).toEqual('oooooo oooooo');
      expect(normalizeString('ûüùúū ÛÜÙÚŪ')).toEqual('uuuuu uuuuu');
      expect(normalizeString('ñń ÑŃ')).toEqual('nn nn');
      expect(normalizeString('çćč ÇĆČ')).toEqual('ccc ccc');
    });

    it('returns an empty string if undefined is passed as value', () => {
      expect(normalizeString(undefined)).toEqual('');
    });
  });

  describe('when `String#normalize` is NOT supported', () => {
    it('trims and lowercases characters', () => {
      /* eslint-disable @typescript-eslint/unbound-method */
      const originalStringNormalize = String.prototype.normalize;
      delete String.prototype.normalize;
      let normalize: (string: string | undefined) => string;

      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        normalize = require('../normalize').normalizeString;
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(normalize('  aàáâäæãåā    ')).toEqual('aàáâäæãåā');
      String.prototype.normalize = originalStringNormalize;
      /* eslint-disable @typescript-eslint/unbound-method */
    });
  });
});
