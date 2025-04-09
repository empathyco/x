import type { UrlParams } from '../../src/types/url-params'
import { h, onBeforeMount } from 'vue'
import StaggeredFadeAndSlide from '../../src/components/animations/staggered-fade-and-slide.vue'
import { XPlugin } from '../../src/plugins/x-plugin'
import MainScrollItem from '../../src/x-modules/scroll/components/main-scroll-item.vue'
import MainScroll from '../../src/x-modules/scroll/components/main-scroll.vue'
import { loadCss } from './css.utils'

function render({
  itemsCount = 10,
  itemHeight = '50px',
  threshold = 0.3,
  margin = '0px',
  useWindow = false,
  windowScrollingElement = undefined as undefined | 'body' | 'html',
  wrapWithAnimation = false,
} = {}) {
  loadCss(
    `${windowScrollingElement === 'body' ? 'html { overflow: hidden; }' : ''}
    html,
    body {
      margin: 0;
      height: 100%;
      max-height: 100%;
    }
    [data-test='scroll'] {
      overflow: auto;
      height: 200px;
    }
    .item { height: ${itemHeight}; }`,
  )
  document.body.dataset.test = document.documentElement.dataset.test = ''
  if (windowScrollingElement === 'body') {
    document.body.dataset.test = 'scroll'
  } else if (windowScrollingElement === 'html') {
    document.documentElement.dataset.test = 'scroll'
  }

  const userScrolledToElementSpy = cy.spy()

  cy.viewport(1920, 200)
  cy.mount({
    setup: () => {
      const items = Array.from({ length: itemsCount }, (_, index) => ({ id: `item-${index}` }))

      onBeforeMount(() => {
        XPlugin.bus.on('UserScrolledToElement').subscribe(userScrolledToElementSpy)
      })

      return () => {
        const mainScrollItemVNodes = items.map(item =>
          h(
            MainScrollItem,
            { item, key: item.id, 'data-test': item.id, class: 'item', tag: 'article' },
            item.id,
          ),
        )

        return h(
          MainScroll,
          { threshold, margin, useWindow },
          h(
            'div',
            { ...(!useWindow && { 'data-test': 'scroll' }) },
            wrapWithAnimation
              ? h(StaggeredFadeAndSlide, mainScrollItemVNodes)
              : mainScrollItemVNodes,
          ),
        )
      }
    },
  })

  return {
    scrollToItem: (index: number) =>
      cy.getByDataTest(`item-${index}`).then($0 => $0.get(0).scrollIntoView()),
    scrollBy: (y: number) =>
      cy.getByDataTest('scroll').then($0 => {
        $0.get(0).scrollBy(0, y)
      }),
    restoreScrollToItem: async (index: number) =>
      XPlugin.bus.emit('ParamsLoadedFromUrl', <UrlParams>{ scroll: `item-${index}` }),
    getItem: (index: number) => cy.getByDataTest(`item-${index}`),
    userScrolledToElementSpy: () => cy.wrap(userScrolledToElementSpy),
  }
}

describe('testing MainScroll component', () => {
  const cases = [
    { description: 'when using the html element', useWindow: true, windowScrollingElement: 'html' },
    { description: 'when using the body element', useWindow: true, windowScrollingElement: 'body' },
    { description: 'when using a custom scrolling element' },
  ]

  cases.forEach(({ description, ...defaultParameters }) => {
    describe(description, () => {
      it('emits the first visible element', () => {
        const { scrollToItem, userScrolledToElementSpy } = render(defaultParameters as any)

        userScrolledToElementSpy().should('have.been.calledOnce').should('have.been.calledWith', '')

        scrollToItem(5)
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5')
      })

      it('ignores the first element of scroll', () => {
        const { scrollToItem, userScrolledToElementSpy } = render(defaultParameters as any)

        scrollToItem(1)
        userScrolledToElementSpy().should('have.been.calledWith', 'item-1')
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-0')

        scrollToItem(0)
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-0')
      })

      it('restores the scroll', () => {
        const { restoreScrollToItem, getItem } = render(defaultParameters as any)

        void restoreScrollToItem(5)

        cy.log('Item 5 should be in view.')
        getItem(5).scrollIntoView().should('be.visible')
      })

      it('restores the scroll with transitions enabled', () => {
        const { restoreScrollToItem, getItem } = render({
          ...(defaultParameters as any),
          wrapWithAnimation: true,
        })

        void restoreScrollToItem(5)

        cy.log('Item 5 should be the first one.')
        getItem(5).scrollIntoView().should('be.visible')
      })

      it('allows configuring when to consider an element visible', () => {
        const { scrollToItem, userScrolledToElementSpy, scrollBy } = render({
          ...(defaultParameters as any),
          threshold: 1,
        })

        scrollToItem(5)
        /* The 5th element should be top aligned now. Because of the threshold=1, it still is the
         first visible element.  */
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5')
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6')
        /* By just scrolling 1 px down, as we require the 100% of the element to intersect to be
         considered visible, the 5th element does no longer meet this condition. Therefore, the 6th
         element is considered the first one.  */
        scrollBy(1)
        userScrolledToElementSpy().should('have.been.calledWith', 'item-6')
      })

      it('allows configuring the bounds of the intersection', () => {
        const { scrollToItem, userScrolledToElementSpy, scrollBy } = render({
          ...(defaultParameters as any),
          margin: '-25px 0px 0px 0px',
          threshold: 0.5,
          itemHeight: '50px',
        })

        scrollToItem(5)
        /* The 5th element should be top aligned now. Because of the 25px negative margin, the
         threshold set at 0.5, and its 50px height, it should still be considered the first visible
         element.  */
        userScrolledToElementSpy().should('have.been.calledWith', 'item-5')
        userScrolledToElementSpy().should('not.have.been.calledWith', 'item-6')
        /* With this configuration, by just scrolling 1 pixel down, the first visible item should
         be considered the 6th element. */
        scrollBy(1)
        userScrolledToElementSpy().should('have.been.calledWith', 'item-6')
      })
    })
  })
})
