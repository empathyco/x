import {
  arrayToObject,
  createArrayComparator,
  deepFilter,
  deepFlat,
  groupItemsBy,
  isArrayEmpty
} from '../array';

describe(`testing ${isArrayEmpty.name} utility method`, () => {
  it('returns `true` when the array is `null`, `undefined` or has no elements', () => {
    expect(isArrayEmpty(undefined)).toEqual(true);
    expect(isArrayEmpty(null)).toEqual(true);
    expect(isArrayEmpty([])).toEqual(true);
  });

  it('returns `false` when the array contains at least 1 element', () => {
    expect(isArrayEmpty([null])).toEqual(false);
  });
});

describe(`testing ${arrayToObject.name} utility method`, () => {
  it('should return an object with the correct format from an array', () => {
    interface ArrayTypeMock {
      targetKey: string;
      p1: string;
      p2: string;
    }

    const arrayMock: ArrayTypeMock[] = [
      {
        targetKey: 'object1',
        p1: 'value1',
        p2: 'value2'
      },
      {
        targetKey: 'object2',
        p1: 'value3',
        p2: 'value4'
      }
    ];

    const dictMock: Record<string, ArrayTypeMock> = {
      object1: {
        targetKey: 'object1',
        p1: 'value1',
        p2: 'value2'
      },
      object2: {
        targetKey: 'object2',
        p1: 'value3',
        p2: 'value4'
      }
    };

    expect(arrayToObject(arrayMock, 'targetKey')).toEqual(dictMock);
  });
});

describe(`testing ${deepFilter.name} utility method`, () => {
  interface ArrayTypeMock {
    id: string;
    condition: boolean;
    next: this[];
  }

  it('should return an array with the filtered elements', () => {
    const arrayMock: ArrayTypeMock[] = [
      {
        id: '1',
        condition: true,
        next: []
      },
      {
        id: '2',
        condition: false,
        next: []
      },
      {
        id: '3',
        condition: true,
        next: []
      }
    ];

    expect(deepFilter(arrayMock, item => item.condition, 'next')).toEqual([
      {
        id: '1',
        condition: true,
        next: []
      },
      {
        id: '3',
        condition: true,
        next: []
      }
    ]);
  });

  it('should return an array with the filtered elements (recursively)', () => {
    const arrayMock: ArrayTypeMock[] = [
      {
        id: '1',
        condition: true,
        next: [
          {
            id: '1-1',
            condition: true,
            next: []
          },
          {
            id: '1-2',
            condition: false,
            next: []
          },
          {
            id: '1-3',
            condition: true,
            next: [
              {
                id: '1-3-1',
                condition: true,
                next: []
              }
            ]
          }
        ]
      },
      {
        id: '2',
        condition: false,
        next: [
          {
            id: '2-1',
            condition: false,
            next: [
              {
                id: '2-1-1',
                condition: true, // not should happen
                next: []
              }
            ]
          },
          {
            id: '2-2',
            condition: true,
            next: []
          }
        ]
      }
    ];

    expect(deepFilter(arrayMock, item => item.condition, 'next')).toStrictEqual([
      {
        id: '1',
        condition: true,
        next: [
          {
            id: '1-1',
            condition: true,
            next: []
          },
          {
            id: '1-2',
            condition: false,
            next: []
          },
          {
            id: '1-3',
            condition: true,
            next: [
              {
                id: '1-3-1',
                condition: true,
                next: []
              }
            ]
          }
        ]
      },
      {
        id: '1-1',
        condition: true,
        next: []
      },
      {
        id: '1-3',
        condition: true,
        next: [
          {
            id: '1-3-1',
            condition: true,
            next: []
          }
        ]
      },
      {
        id: '1-3-1',
        condition: true,
        next: []
      }
    ]);
  });
});

describe(`testing ${deepFlat.name} utility method`, () => {
  interface ArrayTypeMock {
    id: string;
    next: this[];
  }

  it('should return an empty array', () => {
    expect(deepFlat([] as ArrayTypeMock[], 'next')).toStrictEqual([]);
  });

  it('should return an array with the elements at the same depth level', () => {
    const arrayMock: ArrayTypeMock[] = [
      {
        id: '1',
        next: [
          {
            id: '1-1',
            next: []
          },
          {
            id: '1-2',
            next: []
          },
          {
            id: '1-3',
            next: [
              {
                id: '1-3-1',
                next: []
              }
            ]
          }
        ]
      },
      {
        id: '2',
        next: [
          {
            id: '2-1',
            next: [
              {
                id: '2-1-1',
                next: []
              }
            ]
          },
          {
            id: '2-2',
            next: []
          }
        ]
      }
    ];

    expect(deepFlat(arrayMock, 'next')).toStrictEqual([
      {
        id: '1',
        next: [
          {
            id: '1-1',
            next: []
          },
          {
            id: '1-2',
            next: []
          },
          {
            id: '1-3',
            next: [
              {
                id: '1-3-1',
                next: []
              }
            ]
          }
        ]
      },
      {
        id: '1-1',
        next: []
      },
      {
        id: '1-2',
        next: []
      },
      {
        id: '1-3',
        next: [
          {
            id: '1-3-1',
            next: []
          }
        ]
      },
      {
        id: '1-3-1',
        next: []
      },
      {
        id: '2',
        next: [
          {
            id: '2-1',
            next: [
              {
                id: '2-1-1',
                next: []
              }
            ]
          },
          {
            id: '2-2',
            next: []
          }
        ]
      },
      {
        id: '2-1',
        next: [
          {
            id: '2-1-1',
            next: []
          }
        ]
      },
      {
        id: '2-1-1',
        next: []
      },
      {
        id: '2-2',
        next: []
      }
    ]);
  });
});

describe(`testing ${groupItemsBy.name} utility method`, () => {
  it('splits the items into multiple groups', () => {
    const items = [-2, -1, 0, 0, 1, 2];

    const { positive, negative, zero } = groupItemsBy(items, num => {
      if (num < 0) {
        return 'negative';
      } else if (num > 0) {
        return 'positive';
      } else {
        return 'zero';
      }
    });

    expect(negative).toEqual([-2, -1]);
    expect(zero).toEqual([0, 0]);
    expect(positive).toEqual([1, 2]);
  });
});

describe(`testing ${createArrayComparator.name} utility method`, () => {
  it('returns `true` when the arrays are different', () => {
    const simpleComparator = createArrayComparator('query');
    expect(simpleComparator([{ query: 'lego' }], [{ query: 'playmobil' }])).toEqual(true);
    const complexComparator = createArrayComparator<{ query: string }>(
      (item1, item2) => item1.query === item2.query
    );
    expect(complexComparator([{ query: 'lego' }], [{ query: 'playmobil' }])).toEqual(true);
  });

  it('returns `false` when the arrays equal', () => {
    const simpleComparator = createArrayComparator('query');
    expect(simpleComparator([], [])).toEqual(false);
    expect(simpleComparator([{ query: 'lego' }], [{ query: 'lego' }])).toEqual(false);
    const complexComparator = createArrayComparator<{ query: string }>(
      (item1, item2) => item1.query === item2.query
    );
    expect(complexComparator([], [])).toEqual(false);
    expect(complexComparator([{ query: 'lego' }], [{ query: 'lego' }])).toEqual(true);
  });
});
