import { mount } from 'cypress/vue2';
import { createUseDevice } from '../../src/composables/create-use-device';

/**
 * Mounts a test component displaying all the values of the composable created with
 * `createUseDevice`.
 *
 * @param devices - The configuration of the devices breakpoints.
 * @returns An API to test the component.
 */
function mountTestComponent<Device extends string>(
  devices: Record<Device, number>
): MountTestComponentAPI {
  const useDevice = createUseDevice(devices);
  mount({
    setup() {
      return {
        devices: useDevice()
      };
    },
    template: `
        <div>
          <div v-for="(value, device) in devices" :key="device">
            {{ device }}:
            <span :data-test="device">{{ value.value }}</span>
          </div>
        </div>
      `
  });

  return {
    getDeviceValue(key: string) {
      return cy.getByDataTest(key);
    }
  };
}

const defaultDevices = { mobile: 0, tablet: 744, desktop: 1200 };
describe('testing createUseDevice composable factory', () => {
  it('detects the right device', () => {
    const { getDeviceValue } = mountTestComponent(defaultDevices);

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

interface MountTestComponentAPI {
  getDeviceValue: (key: string) => Cypress.Chainable<JQuery>;
}
