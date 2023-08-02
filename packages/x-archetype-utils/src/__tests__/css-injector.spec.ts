import { CssInjector } from '../css-injector/css-injector';
import { WindowWithInjector } from '../css-injector/css-injector.types';

describe('Test custom css injector', () => {
  beforeEach(() => {
    delete (window as WindowWithInjector).xCSSInjector;
  });

  it('reuses the same instance between initializations', () => {
    const injector1 = new CssInjector();
    const injector2 = new CssInjector();

    expect(injector1 === injector2).toBe(true);
  });

  it('can be appended to the window under xCSSInjector', () => {
    const injector = new CssInjector(true);
    const windowCssInjector = (window as WindowWithInjector).xCSSInjector;

    expect(injector === windowCssInjector).toBe(true);
  });

  it('can set the host element that will receive the styles', () => {
    const injector = new CssInjector();
    const domElement = document.createElement('div');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore,
    expect(injector.host).toBe(undefined);

    injector.setHost(domElement);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(injector.host).toBe(domElement);
  });

  it('adds styles string to the set host', () => {
    const injector = new CssInjector();
    const domElement = document.createElement('div');
    const styles = {
      source: "* { background: 'red' }"
    };

    injector.setHost(domElement);
    injector.addStyle(styles);

    expect(domElement.getElementsByTagName('style')[0].textContent).toBe(styles.source);
  });
});
