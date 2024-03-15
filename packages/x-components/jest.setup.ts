import '@testing-library/jest-dom/extend-expect';
import { XDummyBus } from './src/__tests__/bus.dummy';

window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Dummy bus so ReplaySubject doesn't mess with unitary tests
jest.mock('./src/plugins/x-bus', () => ({
  bus: new XDummyBus()
}));
