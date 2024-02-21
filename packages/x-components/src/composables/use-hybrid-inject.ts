import { computed, ComputedRef, inject } from 'vue';

/**
 * Function to use a hybrid inject, which allows to inject a value provided by the regular provide
 * of vue or by the XProvide decorator.
 *
 * @param key - The key of the value to inject.
 * @param defaultValue - The default value to use if the value is not provided.
 * @returns The computed value of the injected value.
 * @public
 */
export function useHybridInject<SomeValue>(
  key: string,
  defaultValue?: SomeValue
): ComputedRef<SomeValue | undefined> {
  type WrappedValue = { value: SomeValue };

  return computed<SomeValue | undefined>(() => {
    const injectedValue = defaultValue
      ? inject<SomeValue | WrappedValue>(key, defaultValue)
      : inject<SomeValue | WrappedValue>(key);

    return injectedValue && typeof injectedValue === 'object' && 'value' in injectedValue
      ? injectedValue.value
      : injectedValue;
  });
}
