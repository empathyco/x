import { createOrigin } from '../origin';

describe(`testing ${createOrigin.name} utility method`, () => {
  it('returns null when the feature is undefined', () => {
    expect(
      createOrigin({
        feature: undefined,
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

  it('returns `feature:location` when the feature and the location are provided', () => {
    expect(
      createOrigin({
        feature: 'url',
        location: 'results'
      })
    ).toEqual('url:results');
  });

  it('returns `feature:none` when the feature is provided but the location is not', () => {
    expect(
      createOrigin({
        feature: 'url',
        location: undefined
      })
    ).toEqual('url:none');
  });
});
