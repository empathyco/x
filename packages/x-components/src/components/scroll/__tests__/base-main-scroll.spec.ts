import { mount, Wrapper } from '@vue/test-utils';
import { getDataTestSelector, installNewXPlugin } from '../../../__tests__/utils';
import BaseMainScroll from '../base-main-scroll.vue';

function renderBaseMainScroll({
  template = `<BaseMainScroll :throttleMs="throttleMs" :tag="tag"/>`,
  throttleMs = 200,
  scrollHeight = 800,
  clientHeight = 200,
  distanceToBottom = 100,
  tag,
  showComponent
}: RenderBaseMainScrollOptions = {}): RenderBaseMainScrollAPI {
  const [, localVue] = installNewXPlugin();
  const wrapperContainer = mount(
    {
      props: ['throttleMs', 'distanceToBottom', 'tag'],
      components: {
        BaseMainScroll
      },
      template,
      data() {
        return { showComponent };
      }
    },
    {
      propsData: {
        throttleMs,
        distanceToBottom,
        tag
      },
      localVue
    }
  );

  const html: Document = window.document;
  jest.spyOn(html.documentElement, 'clientHeight', 'get').mockImplementation(() => clientHeight);
  jest.spyOn(html.documentElement, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);

  const body = html.body;
  jest.spyOn(body, 'clientHeight', 'get').mockImplementation(() => clientHeight);
  jest.spyOn(body, 'scrollHeight', 'get').mockImplementation(() => scrollHeight);

  return {
    wrapperContainer,
    async scrollHtml(options: { to: number; durationMs: number }) {
      html.documentElement.scrollTop = options.to;
      html.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(options.durationMs);
      await wrapperContainer.vm.$nextTick();
    },
    async scrollBody(options: { to: number; durationMs: number }) {
      body.scrollTop = options.to;
      body.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(options.durationMs);
      await wrapperContainer.vm.$nextTick();
    },
    async scrollContent(options: { to: number; durationMs: number }) {
      const scrollContent = wrapperContainer.find(getDataTestSelector('content')).element;
      jest.spyOn(scrollContent, 'clientHeight', 'get').mockImplementation(() => 700);
      jest.spyOn(scrollContent, 'scrollHeight', 'get').mockImplementation(() => 150);

      scrollContent.scrollTop = options.to;
      scrollContent.dispatchEvent(new Event('scroll'));
      jest.advanceTimersByTime(options.durationMs);
      await wrapperContainer.vm.$nextTick();
    },
    async setShowComponent(showComponent: boolean): Promise<void> {
      await wrapperContainer.setData({ showComponent });
      await wrapperContainer.vm.$nextTick();
    }
  };
}

describe('testing Main Scroll Component', () => {
  beforeAll(jest.useFakeTimers);
  afterEach(jest.clearAllTimers);

  describe('html', () => {
    it('throttles the scroll event', async () => {
      const { wrapperContainer, scrollHtml } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'html'
      });

      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollHtml({
        to: 50,
        durationMs: 100
      });
      await scrollHtml({
        to: 100,
        durationMs: 99
      });

      expect(listenerScrolled).not.toHaveBeenCalled();

      await scrollHtml({
        to: 150,
        durationMs: 1
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenNthCalledWith(1, {
        eventPayload: 150,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits the `UserChangedScrollDirection` event when the user changes scrolling direction', async () => {
      const { wrapperContainer, scrollHtml } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'html'
      });

      const listenerChangeDirection = jest.fn();
      wrapperContainer.vm.$x
        .on('UserChangedScrollDirection', true)
        .subscribe(listenerChangeDirection);
      expect(listenerChangeDirection).toHaveBeenCalledTimes(0);

      await scrollHtml({
        to: 300,
        durationMs: 200
      });

      await scrollHtml({
        to: 500,
        durationMs: 200
      });

      await scrollHtml({
        to: 200,
        durationMs: 200
      });

      await scrollHtml({
        to: 100,
        durationMs: 200
      });

      expect(listenerChangeDirection).toHaveBeenCalledTimes(2);
      expect(listenerChangeDirection).toHaveBeenNthCalledWith(1, {
        eventPayload: 'DOWN',
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
      expect(listenerChangeDirection).toHaveBeenNthCalledWith(2, {
        eventPayload: 'UP',
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits the `UserReachedScrollStart` event when the user scrolls back to the top', async () => {
      const { wrapperContainer, scrollHtml } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'html'
      });

      const listenerScrollStart = jest.fn();
      wrapperContainer.vm.$x.on('UserReachedScrollStart', true).subscribe(listenerScrollStart);
      expect(listenerScrollStart).toHaveBeenCalledTimes(0);

      await scrollHtml({
        to: 300,
        durationMs: 200
      });

      await scrollHtml({
        to: 0,
        durationMs: 200
      });

      expect(listenerScrollStart).toHaveBeenCalledTimes(1);
      expect(listenerScrollStart).toHaveBeenNthCalledWith(1, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits `UserAlmostReachedScrollEnd` and`UserReachedScrollEnd` when the user scrolls to the bottom', async () => {
      const { wrapperContainer, scrollHtml } = renderBaseMainScroll({
        throttleMs: 200,
        scrollHeight: 800,
        clientHeight: 200,
        distanceToBottom: 200,
        tag: 'html'
      });

      const listenerAlmostReachedScrollEnd = jest.fn();
      wrapperContainer.vm.$x
        .on('UserAlmostReachedScrollEnd', true)
        .subscribe(listenerAlmostReachedScrollEnd);
      const listenerReachedScrollEnd = jest.fn();
      wrapperContainer.vm.$x.on('UserReachedScrollEnd', true).subscribe(listenerReachedScrollEnd);

      await scrollHtml({
        to: 520,
        durationMs: 200
      });

      expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(1, {
        eventPayload: 80,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });

      await scrollHtml({
        to: 600,
        durationMs: 200
      });

      expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(1, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });

      await scrollHtml({
        to: 0,
        durationMs: 200
      });

      await scrollHtml({
        to: 600,
        durationMs: 200
      });

      expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(2, {
        eventPayload: 0,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
      expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(2, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });
    });

    it('does not trigger event when scrolling in body or other element', async () => {
      const { wrapperContainer, scrollBody, scrollContent } = renderBaseMainScroll({
        template: `<div>
                    <BaseMainScroll :throttleMs="throttleMs" :tag="tag"/>
                    <div data-test="content"></div>
                  </div>`,
        throttleMs: 200,
        tag: 'html'
      });

      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollBody({
        to: 500,
        durationMs: 200
      });

      await scrollContent({
        to: 700,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(0);
    });

    it('do not emit event if component is not rendered or is destroyed', async () => {
      const { wrapperContainer, scrollHtml, setShowComponent } = renderBaseMainScroll({
        template: `<div v-if="showComponent">
                    <BaseMainScroll :throttleMs="throttleMs" :tag="tag"/>
                  </div>`,
        throttleMs: 200,
        tag: 'html',
        showComponent: false
      });

      document.removeEventListener = jest.fn();
      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollHtml({
        to: 600,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await setShowComponent(true);

      await scrollHtml({
        to: 800,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenNthCalledWith(1, {
        eventPayload: 800,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.documentElement,
          id: 'main-scroll'
        }
      });

      await setShowComponent(false);

      await scrollHtml({
        to: 500,
        durationMs: 200
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.removeEventListener).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenCalledTimes(1);
    });
  });

  describe('body', () => {
    it('throttles the scroll event', async () => {
      const { wrapperContainer, scrollBody } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'body'
      });

      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollBody({
        to: 50,
        durationMs: 100
      });
      await scrollBody({
        to: 100,
        durationMs: 99
      });

      expect(listenerScrolled).not.toHaveBeenCalled();

      await scrollBody({
        to: 150,
        durationMs: 1
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenNthCalledWith(1, {
        eventPayload: 150,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits the `UserChangedScrollDirection` event when the user changes scrolling direction', async () => {
      const { wrapperContainer, scrollBody } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'body'
      });

      const listenerChangeDirection = jest.fn();
      wrapperContainer.vm.$x
        .on('UserChangedScrollDirection', true)
        .subscribe(listenerChangeDirection);
      expect(listenerChangeDirection).toHaveBeenCalledTimes(0);

      await scrollBody({
        to: 300,
        durationMs: 200
      });

      await scrollBody({
        to: 500,
        durationMs: 200
      });

      await scrollBody({
        to: 200,
        durationMs: 200
      });

      await scrollBody({
        to: 100,
        durationMs: 200
      });

      expect(listenerChangeDirection).toHaveBeenCalledTimes(2);
      expect(listenerChangeDirection).toHaveBeenNthCalledWith(1, {
        eventPayload: 'DOWN',
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
      expect(listenerChangeDirection).toHaveBeenNthCalledWith(2, {
        eventPayload: 'UP',
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits the `UserReachedScrollStart` event when the user scrolls back to the top', async () => {
      const { wrapperContainer, scrollBody } = renderBaseMainScroll({
        throttleMs: 200,
        tag: 'body'
      });

      const listenerScrollStart = jest.fn();
      wrapperContainer.vm.$x.on('UserReachedScrollStart', true).subscribe(listenerScrollStart);
      expect(listenerScrollStart).toHaveBeenCalledTimes(0);

      await scrollBody({
        to: 300,
        durationMs: 200
      });

      await scrollBody({
        to: 0,
        durationMs: 200
      });

      expect(listenerScrollStart).toHaveBeenCalledTimes(1);
      expect(listenerScrollStart).toHaveBeenNthCalledWith(1, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
    });

    // eslint-disable-next-line max-len
    it('emits `UserAlmostReachedScrollEnd` and`UserReachedScrollEnd` when the user scrolls to the bottom', async () => {
      const { wrapperContainer, scrollBody } = renderBaseMainScroll({
        throttleMs: 200,
        scrollHeight: 800,
        clientHeight: 200,
        distanceToBottom: 200,
        tag: 'body'
      });

      const listenerAlmostReachedScrollEnd = jest.fn();
      wrapperContainer.vm.$x
        .on('UserAlmostReachedScrollEnd', true)
        .subscribe(listenerAlmostReachedScrollEnd);
      const listenerReachedScrollEnd = jest.fn();
      wrapperContainer.vm.$x.on('UserReachedScrollEnd', true).subscribe(listenerReachedScrollEnd);

      await scrollBody({
        to: 520,
        durationMs: 200
      });

      expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(1, {
        eventPayload: 80,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });

      await scrollBody({
        to: 600,
        durationMs: 200
      });

      expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(1, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });

      await scrollBody({
        to: 0,
        durationMs: 200
      });

      await scrollBody({
        to: 600,
        durationMs: 200
      });

      expect(listenerAlmostReachedScrollEnd).toHaveBeenNthCalledWith(2, {
        eventPayload: 0,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
      expect(listenerReachedScrollEnd).toHaveBeenNthCalledWith(2, {
        eventPayload: undefined,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });
    });

    it('does not trigger event when scrolling in document or other element', async () => {
      const { wrapperContainer, scrollHtml, scrollContent } = renderBaseMainScroll({
        template: `<div>
                    <BaseMainScroll :throttleMs="throttleMs" :tag="tag"/>
                    <div data-test="content"></div>
                  </div>`,
        throttleMs: 200,
        tag: 'body'
      });

      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollHtml({
        to: 500,
        durationMs: 200
      });

      await scrollContent({
        to: 700,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(0);
    });

    it('do not emit event if component is not rendered or is destroyed', async () => {
      const { wrapperContainer, scrollBody, setShowComponent } = renderBaseMainScroll({
        template: `<div v-if="showComponent">
                    <BaseMainScroll :throttleMs="throttleMs" :tag="tag"/>
                  </div>`,
        throttleMs: 200,
        tag: 'body',
        showComponent: false
      });

      document.body.removeEventListener = jest.fn();
      const listenerScrolled = jest.fn();
      wrapperContainer.vm.$x.on('UserScrolled', true).subscribe(listenerScrolled);
      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await scrollBody({
        to: 600,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(0);

      await setShowComponent(true);

      await scrollBody({
        to: 800,
        durationMs: 200
      });

      expect(listenerScrolled).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenNthCalledWith(1, {
        eventPayload: 800,
        metadata: {
          moduleName: null, // no module registered for this base component
          target: document.body,
          id: 'main-scroll'
        }
      });

      await setShowComponent(false);

      await scrollBody({
        to: 500,
        durationMs: 200
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(document.body.removeEventListener).toHaveBeenCalledTimes(1);
      expect(listenerScrolled).toHaveBeenCalledTimes(1);
    });
  });
});

interface RenderBaseMainScrollOptions {
  /** The template to be rendered. */
  template?: string;
  /** Number for throttle of scroll. */
  throttleMs?: number;
  /** Number of scroll height of main scroll. */
  scrollHeight?: number;
  /** Number of client height of main scroll. */
  clientHeight?: number;
  /** Distance to the end of the main scroll. */
  distanceToBottom?: number;
  /** Tag where apply the scroll. */
  tag?: 'html' | 'body';
  /** If it will show the BaseMainScroll or not. */
  showComponent?: boolean;
}

interface RenderBaseMainScrollAPI {
  /** The wrapper for the base scroll component. */
  wrapperContainer: Wrapper<Vue>;
  /** Function that dispatch the event scroll document. */
  scrollHtml: (options: { to: number; durationMs: number }) => Promise<void>;
  /** Function that dispatch the event scroll body. */
  scrollBody: (options: { to: number; durationMs: number }) => Promise<void>;
  /** Function that change variable of showComponent for show or not the BaseMainScroll. */
  setShowComponent: (showComponent: boolean) => Promise<void>;
  /** Function that dispatch the event scroll about a element. */
  scrollContent: (options: { to: number; durationMs: number }) => Promise<void>;
}
