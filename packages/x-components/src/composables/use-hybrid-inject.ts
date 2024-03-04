import { inject, isReactive, isRef, reactive, Ref, ref, UnwrapRef } from 'vue';
import { UnwrapNestedRefs } from 'vue/types/v3-generated';

/**
 * Makes the injection reactive if it is not already.
 *
 * @param injection - The injection to make reactive.
 *
 * @returns The reactive injection.
 * @internal
 */
const makeInjectionReactive = <SomeValue>(
  injection: SomeValue | { value: SomeValue } | undefined
): Ref<UnwrapRef<SomeValue>> | UnwrapNestedRefs<SomeValue> | SomeValue | undefined => {
  // Check if the injection comes from XProvide and it is not already reactive.
  if (
    !!injection &&
    typeof injection === 'object' &&
    'value' in injection &&
    (!isRef(injection) || !isReactive(injection))
  ) {
    const xRefValue = injection.value;

    if (xRefValue && typeof xRefValue === 'object') {
      return reactive(xRefValue);
    } else {
      return ref<SomeValue>(xRefValue);
    }
  }

  return injection as SomeValue | undefined;
};

/**
 * Function to use a hybrid inject, which allows to inject a value provided by the regular provide
 * of vue or by the XProvide decorator.
 *
 * @param key - The key of the value to inject.
 * @param defaultValue - The default value to use if the value is not provided.
 * @returns The computed value of the injected value.
 * @public
 */
/* eslint-disable */
export function useHybridInject<SomeValue>(key: string, defaultValue: SomeValue): SomeValue;
export function useHybridInject<SomeValue>(key: string): SomeValue | undefined;
export function useHybridInject<SomeValue>(key: string, defaultValue?: SomeValue) {
  /* eslint-enable */
  type WrappedValue = { value: SomeValue };

  const injection = defaultValue
    ? inject<SomeValue | WrappedValue>(key, defaultValue)
    : inject<SomeValue | WrappedValue>(key);

  return makeInjectionReactive<SomeValue>(injection);
}
