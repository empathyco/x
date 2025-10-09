import {
  extractUrlParameters,
  getDisplayTaggingInfoFromUrl,
  getTaggingInfoFromUrl,
} from '../url.utils'

describe('url utils methods tests', () => {
  describe('extractUrlParameters', () => {
    it('should not break when dealing with bad urls', () => {
      const { url, params } = extractUrlParameters('null')
      expect(url).toBe('null')
      expect(params).toBe(undefined)
    })

    it('should retrieve the url and the params', () => {
      const { url, params } = extractUrlParameters(
        'https://api.empathy.co/?q=chips&env=mobile&lang=english&lang=spanish',
      )
      expect(url).toBe('https://api.empathy.co/')
      expect(params).toStrictEqual({
        q: 'chips',
        env: 'mobile',
        lang: ['english', 'spanish'],
      })
    })
  })

  describe('getTaggingInfoFromUrl', () => {
    it('should not break when dealing with bad urls', () => {
      expect(getTaggingInfoFromUrl('null')).toStrictEqual({
        url: 'null',
        params: { follow: false },
      })
    })

    it('should retrieve the tagging info from the url', () => {
      const { url, params } = getTaggingInfoFromUrl(
        'https://api.empathy.co/?q=chips&env=mobile&lang=english&lang=spanish',
      )
      expect(url).toBe('https://api.empathy.co/')
      expect(params).toStrictEqual({
        q: 'chips',
        env: 'mobile',
        lang: ['english', 'spanish'],
        follow: false,
      })
    })
  })

  describe('getDisplayClickTagging', () => {
    it('should not break when dealing with bad urls', () => {
      expect(getDisplayTaggingInfoFromUrl('null')).toStrictEqual({
        url: 'null',
        params: { displayId: 'no_query', follow: false },
      })
    })

    it('should retrieve the tagging info from the url, replacing q with displayId', () => {
      const { url, params } = getDisplayTaggingInfoFromUrl(
        'https://api.empathy.co/?q=chips&env=mobile&lang=english&lang=spanish',
      )
      expect(url).toBe('https://api.empathy.co/')
      expect(params).toStrictEqual({
        displayId: 'chips',
        env: 'mobile',
        lang: ['english', 'spanish'],
        follow: false,
      })
    })

    it('should set no_query tagging info when no q param exist as in topclicked response', () => {
      const { url, params } = getDisplayTaggingInfoFromUrl(
        'https://api.empathy.co/?env=mobile&lang=english&lang=spanish',
      )
      expect(url).toBe('https://api.empathy.co/')
      expect(params).toStrictEqual({
        displayId: 'no_query',
        env: 'mobile',
        lang: ['english', 'spanish'],
        follow: false,
      })
    })
  })
})
