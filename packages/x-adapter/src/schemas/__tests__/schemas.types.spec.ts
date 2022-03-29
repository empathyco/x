interface Source {
  data: {
    a: string;
    b: number;
  };
  facets: {
    filter: string;
    count: number;
  };
  list: { id: string }[];
}

interface Target {
  count: number;
  filter: {
    value: string;
    num: number;
  };
  name: {
    title: string;
  };
}

/**
 * The following tests might look like silly ones that are not doing anything at all. However,
 * the goal of having them is to trigger typescript to check that the types are valid,
 * even if the assertions are not useful. So if we refactor the types and break something
 * typescript will complain when running the tests, and they will fail.
 */
describe('Schema', () => {
  it('Returns an schema', () => {
    expect(true).toBe(true);
  });
});
