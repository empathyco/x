import { BaseXBus } from '../../../plugins/x-bus';
import { BaseXAPI } from '../base-api';

describe('testing default X API', () => {
  const defaultXAPI = new BaseXAPI();
  const bus = new BaseXBus();
  defaultXAPI.setBus(bus);
  const query = 'maserati';

  it('should emit `UserAcceptedAQuery` through the `search` function', () => {
    const listener = jest.fn();
    bus.on('UserAcceptedAQuery').subscribe(listener);

    defaultXAPI.search(query);

    expect(listener).toHaveBeenCalledWith(query);
  });

  it('should emit `UserClickedPDPAddToCart` through the `addProductToCart` function', () => {
    const listener = jest.fn();
    bus.on('UserClickedPDPAddToCart').subscribe(listener);

    defaultXAPI.addProductToCart();

    expect(listener).toHaveBeenCalledTimes(1);

    const productId = '123abc';
    defaultXAPI.addProductToCart(productId);
    expect(listener).toHaveBeenCalledWith(productId);
  });
});
