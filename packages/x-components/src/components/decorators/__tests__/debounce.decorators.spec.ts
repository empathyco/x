import { mount, Wrapper } from '@vue/test-utils';
import Vue, { CreateElement, VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import { DebounceOptions } from '../../../utils/types';
import { Debounce } from '../debounce.decorators';

function renderDebounceDecoratorComponent(
  debounceTime: number,
  debounceOptions?: DebounceOptions
): DebounceDecoratorComponentAPI {
  const mockedDebouncedFunction = jest.fn();

  @Component
  class TestingComponent extends Vue {
    @Debounce(debounceTime, debounceOptions)
    debounceTest(mockArgument?: any): void {
      mockedDebouncedFunction(mockArgument);
    }

    render(createElement: CreateElement): VNode {
      return createElement();
    }
  }

  const component = mount(TestingComponent);

  return {
    component,
    debounceTest(mockArgument?: any) {
      return component.vm.debounceTest(mockArgument);
    },
    mockedDebouncedFunction
  };
}

const defaultDebounceTime = 100;

describe('testing debounce decorator', () => {
  jest.useFakeTimers();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debounces the method for the provided time', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { debounceTest, mockedDebouncedFunction } = renderDebounceDecoratorComponent(
      defaultDebounceTime
    );

    debounceTest();
    expect(mockedDebouncedFunction).not.toHaveBeenCalled();
    debounceTest();
    debounceTest();
    jest.advanceTimersByTime(defaultDebounceTime);
    expect(mockedDebouncedFunction).toHaveBeenCalledTimes(1);
  });

  it('debounces the method for the provided time and options', () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const {
      debounceTest,
      mockedDebouncedFunction
    } = renderDebounceDecoratorComponent(defaultDebounceTime, { leading: true, trailing: false });

    debounceTest();
    expect(mockedDebouncedFunction).toHaveBeenCalledTimes(1);
    debounceTest();
    debounceTest();
    jest.advanceTimersByTime(defaultDebounceTime);
    expect(mockedDebouncedFunction).toHaveBeenCalledTimes(1);
  });

  it('applies the arguments correctly to the decorated method', () => {
    const mockedArgument = 'potatoe';
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { debounceTest, mockedDebouncedFunction } = renderDebounceDecoratorComponent(
      defaultDebounceTime
    );

    debounceTest(mockedArgument);
    jest.advanceTimersByTime(defaultDebounceTime);
    expect(mockedDebouncedFunction).toHaveBeenCalledWith(mockedArgument);
  });
});

interface DebounceDecoratorComponentAPI {
  component: Wrapper<Vue>;
  debounceTest(mockArgument?: any): void;
  mockedDebouncedFunction(): jest.Mock;
}
