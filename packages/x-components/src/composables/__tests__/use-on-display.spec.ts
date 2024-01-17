import { ref, nextTick } from 'vue';
import { useElementVisibility } from '@vueuse/core';
import { useEmitDisplayEvent, useOnDisplay } from '../use-on-display';
import { use$x } from '../use-$x';

jest.mock('@vueuse/core', () => ({
  useElementVisibility: jest.fn()
}));

const refElementVisibility = ref(false);
(useElementVisibility as jest.Mock).mockReturnValue(refElementVisibility);

jest.mock('../use-$x', () => ({
  use$x: jest.fn()
}));

const $xEmitSpy = jest.fn();
(use$x as jest.Mock).mockReturnValue({
  emit: $xEmitSpy
});

describe(`testing ${useOnDisplay.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false;
  });

  function renderUseOnDisplayTester({
    element = document.createElement('div'),
    triggerOnce = true
  }: RenderUseOnDisplayTesterOptions = {}): RenderUseOnDisplayTesterAPI {
    const callbackSpy = jest.fn();

    const { isElementVisible, unwatchDisplay } = useOnDisplay({
      element,
      callback: callbackSpy,
      ...(!triggerOnce && { triggerOnce })
    });

    const toggleElementVisibility = async (): Promise<void> => {
      refElementVisibility.value = !refElementVisibility.value;
      await nextTick();
    };

    return {
      callbackSpy,
      toggleElementVisibility,
      isElementVisible,
      unwatchDisplay
    };
  }

  it('uses the useElementVisibility composable underneath', () => {
    renderUseOnDisplayTester();
    expect(useElementVisibility).toHaveBeenCalled();
  });

  it('uses a provided element for useElementVisibility to watch', () => {
    const element = document.createElement('div');
    renderUseOnDisplayTester({ element });
    expect(useElementVisibility).toHaveBeenCalledWith(element);
  });

  it('triggers callback when the element changes from not visible to visible', async () => {
    const { callbackSpy, toggleElementVisibility } = renderUseOnDisplayTester();

    await toggleElementVisibility();

    expect(callbackSpy).toHaveBeenCalled();
  });

  it('triggers the callback only once by default', async () => {
    const { callbackSpy, toggleElementVisibility } = renderUseOnDisplayTester();

    await toggleElementVisibility();
    await toggleElementVisibility();
    await toggleElementVisibility();

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('can remove the triggering repetition limitation', async () => {
    const { callbackSpy, toggleElementVisibility } = renderUseOnDisplayTester({
      triggerOnce: false
    });

    await toggleElementVisibility();
    await toggleElementVisibility();
    await toggleElementVisibility();

    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });

  it('exposes the current visibility of the element', async () => {
    const { toggleElementVisibility, isElementVisible } = renderUseOnDisplayTester();

    expect(isElementVisible.value).toBe(false);

    await toggleElementVisibility();
    expect(isElementVisible.value).toBe(true);

    await toggleElementVisibility();
    expect(isElementVisible.value).toBe(false);
  });

  it('exposes the watch stop handle for the callback', async () => {
    const { callbackSpy, toggleElementVisibility, unwatchDisplay } = renderUseOnDisplayTester();

    unwatchDisplay();

    await toggleElementVisibility();
    expect(callbackSpy).not.toHaveBeenCalled();
  });
});

describe(`testing ${useEmitDisplayEvent.name} composable`, () => {
  beforeEach(() => {
    refElementVisibility.value = false;
    jest.clearAllMocks();
  });

  function renderUseEmitDisplayEvent({
    element = document.createElement('div'),
    taggingRequest = {
      url: '',
      params: {}
    }
  }: RenderUseEmitDisplayEventOptions = {}): RenderUseEmitDisplayEventAPI {
    const { isElementVisible, unwatchDisplay } = useEmitDisplayEvent({
      element,
      taggingRequest
    });

    const toggleElementVisibility = async (): Promise<void> => {
      refElementVisibility.value = !refElementVisibility.value;
      await nextTick();
    };

    return {
      toggleElementVisibility,
      isElementVisible,
      unwatchDisplay
    };
  }

  it('uses the useElementVisibility composable underneath', () => {
    renderUseEmitDisplayEvent();
    expect(useElementVisibility).toHaveBeenCalled();
  });

  it('uses a provided element for useElementVisibility to watch', () => {
    const element = document.createElement('div');
    renderUseEmitDisplayEvent({ element });
    expect(useElementVisibility).toHaveBeenCalledWith(element);
  });

  // eslint-disable-next-line max-len
  it('emits `TrackableElementDisplayed` when the element is visible with the provided tagging request', async () => {
    const { toggleElementVisibility } = renderUseEmitDisplayEvent({
      taggingRequest: {
        url: 'test-url',
        params: { test: 'param' }
      }
    });

    await toggleElementVisibility();

    expect($xEmitSpy).toHaveBeenCalled();
    expect($xEmitSpy).toHaveBeenCalledWith('TrackableElementDisplayed', {
      params: { test: 'param' },
      url: 'test-url'
    });
  });

  it('emits the event only once', async () => {
    const { toggleElementVisibility } = renderUseEmitDisplayEvent();

    await toggleElementVisibility();
    await toggleElementVisibility();
    await toggleElementVisibility();

    expect($xEmitSpy).toHaveBeenCalledTimes(1);
  });

  it('exposes the current visibility of the element', async () => {
    const { toggleElementVisibility, isElementVisible } = renderUseEmitDisplayEvent();

    expect(isElementVisible.value).toBe(false);

    await toggleElementVisibility();
    expect(isElementVisible.value).toBe(true);

    await toggleElementVisibility();
    expect(isElementVisible.value).toBe(false);
  });

  it('exposes the watch stop handle for the callback', async () => {
    const { toggleElementVisibility, unwatchDisplay } = renderUseEmitDisplayEvent();

    unwatchDisplay();

    await toggleElementVisibility();
    expect($xEmitSpy).not.toHaveBeenCalled();
  });
});

/**
 * Options to configure how the useOnDisplay composable should be rendered.
 */
type RenderUseOnDisplayTesterOptions = {
  /** The element to watch. */
  element?: HTMLElement;
  /** Whether the callback should be triggered only once or not. */
  triggerOnce?: boolean;
};

/**
 * Tools to test how the useOnDisplay composable behaves.
 */
type RenderUseOnDisplayTesterAPI = {
  /** The callback spy. */
  callbackSpy: jest.Mock;
  /** Toggle element visibility. */
  isElementVisible: ReturnType<typeof useElementVisibility>;
  /** The watch stop handle for the callback. */
  unwatchDisplay: () => void;
  /** Toggle element visibility. */
  toggleElementVisibility: () => Promise<void>;
};

/**
 * Options to configure how the useEmitDisplayEvent composable should be rendered.
 */
type RenderUseEmitDisplayEventOptions = {
  /** The element to watch. */
  element?: HTMLElement;
  /** The payload for the `TrackableElementDisplayed` event. */
  taggingRequest?: any;
};

/**
 * Tools to test how the useOnDisplay composable behaves.
 */
type RenderUseEmitDisplayEventAPI = {
  /** The visibility of the element. */
  isElementVisible: ReturnType<typeof useElementVisibility>;
  /** The watch stop handle for the callback. */
  unwatchDisplay: () => void;
  /** Toggle element visibility. */
  toggleElementVisibility: () => Promise<void>;
};
