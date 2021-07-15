import { createDecorator } from 'vue-class-component';
import { debounce } from '../../utils/debounce';
import { AnyFunction, DebounceOptions, DecoratorFor } from '../../utils/types';

/**
 * Adds debounce to the method that the decorator is applied to.
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
  });
}
