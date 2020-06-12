import { installNewXPlugin } from '../../__tests__/utils';
import { currency } from '../currency/currency.filter';

describe('testing Currency filter', () => {
  installNewXPlugin();

  it('should return the value formatted by the custom options', () => {
    expect(currency(288.123, { symbol: '¥' })).toBe('288,12 ¥');
  });

  it('should return the value formatted by the default options', () => {
    expect(currency(481516.2342)).toBe('481.516,23 €');
  });
});
