import { XPriorityBus } from '../index';

describe('x-bus with priority queue', () => {
  it('emits events', async () => {
    const bus = new XPriorityBus();

    await bus.emit('stub').then(() => {
      expect(false);
    });
  });
});
