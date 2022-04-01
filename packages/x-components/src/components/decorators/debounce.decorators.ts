import { AnyFunction } from '@empathyco/x-utils';
import { createDecorator } from 'vue-class-component';
import { debounce } from '../../utils/debounce';
import { DebounceOptions, DecoratorFor } from '../../utils/types';

/**
 * Adds debounce to the method that the decorator is applied to.
 *
 * @remarks Pending debounced execution is cancelled when the component is destroyed.
 *
 * @param debounceTimeInMs - The time of debounce in ms.
 * @param debounceOptions - The options for the debounce strategy.
 *
 * @returns Decorator that applies debounce.
 *
 * @public
 */
export function Debounce(
  debounceTimeInMs: number,
  debounceOptions: DebounceOptions = {}
): DecoratorFor<AnyFunction> {
  return createDecorator((options, key) => {
    const originalMethod = options.methods![key];
    const debouncedMethod = debounce(
      (context: Vue, args: unknown[]) => originalMethod.call(context, ...args),
      debounceTimeInMs,
      debounceOptions
    );

    options.methods![key] = function debouncedWrapper(...args: unknown[]) {
      debouncedMethod(this, args);
    };

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalBeforeDestroy = options.beforeDestroy;
    Object.assign(options, {
      beforeDestroy(this: Vue) {
        originalBeforeDestroy?.apply(this);
        debouncedMethod.cancel();
      }
    });
  });
}
