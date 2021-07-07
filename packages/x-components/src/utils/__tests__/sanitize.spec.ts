import { mount } from '@vue/test-utils';
import { sanitize } from '../sanitize';

describe('testing sanitize function', () => {
  it('replaces "<" and ">" characters in a string to their HTML entity number', () => {
    const stringHtmlElement = '<script>alert("virus")</script>';
    const sanitizedString = sanitize(stringHtmlElement);
    expect(sanitizedString).toBe('&#60;script&#62;alert("virus")&#60;/script&#62;');
  });

  it('replaces "&" character in a string to their HTML entity number', () => {
    const stringHtmlElement = '&lt;script&gt;alert("virus")&lt;/script&gt;';
    const sanitizedString = sanitize(stringHtmlElement);
    expect(sanitizedString).toBe('&#38;lt;script&#38;gt;alert("virus")&#38;lt;/script&#38;gt;');
  });

  it('should sanitize an HTML element used in a v-html', () => {
    const Component = {
      template: ' <div v-html="XSSPayload"></div>',
      props: ['XSSPayload']
    };
    const component = mount(Component, {
      propsData: {
        XSSPayload: sanitize('<span onmouseover="window.alert(\'virus\')"></span>')
      }
    });
    expect(component.html()).toEqual(
      `<div>&lt;span onmouseover="window.alert('virus')"&gt;&lt;/span&gt;</div>`
    );
  });

  it('sanitized a HTML element to avoid XSS', () => {
    const XSSPayloadSanitized = '<span onmouseover="window.alert(`sanitize`)"></span>';
    document.body.innerHTML = sanitize(XSSPayloadSanitized);
    expect(document.body.innerHTML).toEqual(
      '&lt;span onmouseover="window.alert(`sanitize`)"&gt;&lt;/span&gt;'
    );
  });
});
