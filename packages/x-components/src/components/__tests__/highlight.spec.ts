import { mount } from '@vue/test-utils'
import { getDataTestSelector } from '../../__tests__/utils'
import Highlight from '../highlight.vue'

function renderHighlight({
  slots = {},
  text = '',
  highlight = '',
  noMatchClass = '',
  matchingPartClass = '',
  matchClass = '',
} = {}) {
  const wrapper = mount(Highlight, {
    props: {
      text,
      highlight,
      noMatchClass,
      matchingPartClass,
      matchClass,
    },
    slots: { ...slots },
  })
  return {
    wrapper,
    getStartPart: () => wrapper.find(getDataTestSelector('highlight-start')),
    getMatchingPart: () => wrapper.find(getDataTestSelector('matching-part')),
    getEndPart: () => wrapper.find(getDataTestSelector('highlight-end')),
    setHighlight: async (highlight: string) => wrapper.setProps({ highlight } as any),
  }
}

describe('testing Highlight component', () => {
  it('highlights the rendered text when the match happens at the beginning', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Ibérico',
      highlight: 'ibe',
    })
    expect(wrapper.text()).toEqual('Ibérico')
    expect(getStartPart().exists()).toBe(false)
    expect(getMatchingPart().text()).toEqual('Ibé')
    expect(getEndPart().text()).toBe('rico')
  })

  it('highlights the rendered text when the match happens at the middle', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Picaña',
      highlight: 'can',
    })
    expect(wrapper.text()).toEqual('Picaña')
    expect(getStartPart().text()).toBe('Pi')
    expect(getMatchingPart().text()).toEqual('cañ')
    expect(getEndPart().text()).toBe('a')
  })

  it('highlights the rendered text when the match happens at the end', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Jamón Ibérico',
      highlight: 'iberico',
    })
    expect(wrapper.text()).toEqual('Jamón Ibérico')
    expect(getStartPart().text()).toBe('Jamón')
    expect(getMatchingPart().text()).toEqual('Ibérico')
    expect(getEndPart().exists()).toBe(false)
  })

  it('highlights the text properly when it contains spaces at the start & end', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: ' tinean chosco ',
      highlight: 'cho',
    })
    expect(wrapper.text()).toEqual('tinean chosco')
    expect(getStartPart().text()).toBe('tinean')
    expect(getMatchingPart().text()).toEqual('cho')
    expect(getEndPart().text()).toBe('sco')
  })

  it('ignores spaces at the start & end of the text to highlight', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'Butiello',
      highlight: ' tie ',
    })
    expect(wrapper.text()).toEqual('Butiello')
    expect(getStartPart().text()).toBe('Bu')
    expect(getMatchingPart().text()).toEqual('tie')
    expect(getEndPart().text()).toBe('llo')
  })

  it('renders the given text if no match', () => {
    const { getStartPart, getMatchingPart, getEndPart, wrapper } = renderHighlight({
      text: 'vacío',
      highlight: 'chorizo',
    })
    expect(wrapper.text()).toEqual('vacío')
    expect(getStartPart().text()).toBe('vacío')
    expect(getMatchingPart().exists()).toBe(false)
    expect(getEndPart().exists()).toBe(false)
  })

  it('allows to add classes when the text matches', () => {
    const { getMatchingPart, wrapper } = renderHighlight({
      text: 'salchichón',
      highlight: 'sal',
      matchClass: 'custom-match-class',
      matchingPartClass: 'custom-matching-part-class',
    })

    expect(wrapper.classes('custom-match-class')).toBe(true)
    expect(getMatchingPart().classes('custom-matching-part-class')).toBe(true)
  })

  it('allows to add classes when the text does not match', () => {
    const { wrapper } = renderHighlight({
      text: 'salchichón',
      highlight: 'soy',
      noMatchClass: 'custom-no-match-class',
    })
    expect(wrapper.classes('custom-no-match-class')).toBe(true)
  })

  it('allows customising the HTML', async () => {
    const customHtml = `
        <span v-if="hasMatch" class="match-custom-layout">
          <strong>{{ start }}</strong>{{ match }}<strong>{{ end }}</strong>
        </span>
        <span v-else class="no-match-custom">{{ text }}</span>`
    const { wrapper, setHighlight } = renderHighlight({
      slots: { default: customHtml },
      text: 'churrasco',
      highlight: 'chur',
    })
    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<span class="match-custom-layout"><strong></strong>chur<strong>rasco</strong></span>"`,
    )

    await setHighlight('no-match')
    expect(wrapper.html()).toMatchInlineSnapshot(`"<span class="no-match-custom">churrasco</span>"`)
  })
})
