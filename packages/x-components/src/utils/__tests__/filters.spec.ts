import { getHierarchicalFilterStub } from '../../__stubs__/filters-stubs.factory';
import { isFilterPartiallySelected } from '../filters';

describe(`testing ${isFilterPartiallySelected.name}`, () => {
  it('returns `false` when the root filter is selected and has no children selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          children: [getHierarchicalFilterStub()]
        }),
        getHierarchicalFilterStub()
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(false);
  });

  it('returns `false` when the root filter is selected and every child is selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(false);
  });

  // eslint-disable-next-line max-len
  it('returns `true` when the root filter is selected and not all the child filters at a same level are selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: true,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            }),
            getHierarchicalFilterStub({
              selected: false
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(true);
  });

  // eslint-disable-next-line max-len
  it('returns `true` when the root filter is NOT selected and not all the child filters at a same level are selected', () => {
    const filter = getHierarchicalFilterStub({
      selected: false,
      children: [
        getHierarchicalFilterStub({
          selected: true,
          children: [
            getHierarchicalFilterStub({
              selected: true
            }),
            getHierarchicalFilterStub({
              selected: false
            })
          ]
        }),
        getHierarchicalFilterStub({
          selected: true
        })
      ]
    });

    expect(isFilterPartiallySelected(filter)).toEqual(true);
  });
});
