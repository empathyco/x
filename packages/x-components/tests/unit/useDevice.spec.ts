import { h, Ref } from 'vue';
import { createUseDevice } from '../../src/composables/create-use-device';

function render() {
  const useDevice = createUseDevice({ mobile: 0, tablet: 744, desktop: 1200 });

  cy.mount({
    setup: () => {
      const devices = useDevice() as Record<string, Ref<boolean>>;

      return () =>
        Object.entries(devices).map(([device, value]) =>
          h('div', { key: device }, [
            h('span', device),
            h('span', ' - '),
            h('span', { 'data-test': device }, value.value)
          ])
        );
    }
  });

  return {
    getDeviceValue: (key: string) => cy.getByDataTest(key)
  };
}

describe('testing createUseDevice composable factory', () => {
  it('detects the right device', () => {
    const { getDeviceValue } = render();

    cy.viewport(1300, 800);

    getDeviceValue('isDesktop').should('contain.text', 'true');
    getDeviceValue('isDesktopOrGreater').should('contain.text', 'true');
    getDeviceValue('isDesktopOrLess').should('contain.text', 'true');

    getDeviceValue('isTablet').should('contain.text', 'false');
    getDeviceValue('isTabletOrGreater').should('contain.text', 'true');
    getDeviceValue('isTabletOrLess').should('contain.text', 'false');

    getDeviceValue('isMobile').should('contain.text', 'false');
    getDeviceValue('isMobileOrGreater').should('contain.text', 'true');
    getDeviceValue('isMobileOrLess').should('contain.text', 'false');

    getDeviceValue('deviceName').should('contain.text', 'desktop');

    cy.viewport(744, 800);

    getDeviceValue('isDesktop').should('contain.text', 'false');
    getDeviceValue('isDesktopOrGreater').should('contain.text', 'false');
    getDeviceValue('isDesktopOrLess').should('contain.text', 'true');

    getDeviceValue('isTablet').should('contain.text', 'true');
    getDeviceValue('isTabletOrGreater').should('contain.text', 'true');
    getDeviceValue('isTabletOrLess').should('contain.text', 'true');

    getDeviceValue('isMobile').should('contain.text', 'false');
    getDeviceValue('isMobileOrGreater').should('contain.text', 'true');
    getDeviceValue('isMobileOrLess').should('contain.text', 'false');

    getDeviceValue('deviceName').should('contain.text', 'tablet');

    cy.viewport(400, 800);

    getDeviceValue('isDesktop').should('contain.text', 'false');
    getDeviceValue('isDesktopOrGreater').should('contain.text', 'false');
    getDeviceValue('isDesktopOrLess').should('contain.text', 'true');

    getDeviceValue('isTablet').should('contain.text', 'false');
    getDeviceValue('isTabletOrGreater').should('contain.text', 'false');
    getDeviceValue('isTabletOrLess').should('contain.text', 'true');

    getDeviceValue('isMobile').should('contain.text', 'true');
    getDeviceValue('isMobileOrGreater').should('contain.text', 'true');
    getDeviceValue('isMobileOrLess').should('contain.text', 'true');

    getDeviceValue('deviceName').should('contain.text', 'mobile');
  });
});
