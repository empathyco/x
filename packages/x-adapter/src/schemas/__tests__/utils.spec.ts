import { Schema } from '../schemas.types';
import { makeSchemaMutable } from '../utils';
import { schemaMapperFactory } from '../../mappers';

describe('MutableSchemas', () => {
  interface Facet {
    id: string;
    label: string;
    count: number;
  }

  interface OriginalSource {
    q: string;
    rows: number;
    facets: Facet[];
  }

  interface CustomSource {
    data: {
      query: string;
      total: {
        rows: number;
      };
    };
    rows?: number;
  }

  interface OriginalTarget {
    query: string;
    hits: number;
  }

  interface CustomTarget {
    search: string;
    total: number;
  }

  it('Creates a mutable schema', () => {
    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };
    const mutableSchema = makeSchemaMutable(originalSchema);
    expect(mutableSchema.query).toBe('q');
    expect(mutableSchema.hits).toBe('rows');
    expect(typeof mutableSchema.$replace).toBe('function');
    expect(typeof mutableSchema.$override).toBe('function');
  });

  it('should replace a schema with a new one', () => {
    const source: OriginalSource = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const customSource: CustomSource = {
      data: {
        query: 'Sony',
        total: {
          rows: 24
        }
      }
    };

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };

    const customSchema: Schema<CustomSource, CustomTarget> = {
      search: 'data.query',
      total: 'data.total.rows'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const customTarget: CustomTarget = {
      search: 'Sony',
      total: 24
    };

    const mutableSchema = makeSchemaMutable(originalSchema);
    const mapper = schemaMapperFactory<any, any>(mutableSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.$replace(customSchema);
    expect(mapper(customSource, {})).toStrictEqual(customTarget);
  });

  it('should override the original schema', () => {
    const source: OriginalSource = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const customSource: CustomSource = {
      data: {
        query: 'Sony',
        total: {
          rows: 24
        }
      },
      rows: 99
    };

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };

    const customSchema: Schema<CustomSource, Partial<OriginalTarget>> = {
      query: 'data.query'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const overrideTarget: OriginalTarget = {
      query: 'Sony',
      hits: 99
    };

    const mutableSchema = makeSchemaMutable(originalSchema);
    const mapper = schemaMapperFactory<any, any>(mutableSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.$override(customSchema);
    expect(mapper(customSource, {})).toStrictEqual(overrideTarget);

    const removeHitsFieldSchema: Schema<CustomSource, Partial<OriginalTarget>> = {
      query: 'data.query',
      hits: undefined
    };

    mutableSchema.$override(removeHitsFieldSchema);
    expect(mapper(customSource, {})).toStrictEqual({
      query: 'Sony'
    });
  });
});
