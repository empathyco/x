import { createOrigin } from '../origin';

describe(`testing ${createOrigin.name} utility method`, () => {
  it('returns null when the feature or the location is undefined', () => {
    expect(
      createOrigin({
        feature: undefined,
        location: undefined
      })
    ).toBeNull();
    expect(
      createOrigin({
        feature: 'history_query',
        location: undefined
      })
    ).toBeNull();
    expect(
      createOrigin({
        feature: undefined,
        location: 'predictive_layer'
      })
    ).toBeNull();
  });

  it('returns `feature:location` when the feature or the location is provided', () => {
    expect(
      createOrigin({
        feature: 'url',
        location: 'results'
      })
    ).toEqual('url:results');
  });
});
