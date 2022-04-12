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
  }

  interface OriginalTarget {
    query: string;
    hits: number;
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

    const customSchema: Schema<CustomSource, OriginalTarget> = {
      query: 'data.query',
      hits: 'data.total.rows'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const customTarget: OriginalTarget = {
      query: 'Sony',
      hits: 24
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

    const originalSchema: Schema<OriginalSource, OriginalTarget> = {
      query: 'q',
      hits: 'rows'
    };

    const customSchema: Schema<OriginalSource, Partial<OriginalTarget>> = {
      query: 'facets.0.label'
    };

    const originalTarget: OriginalTarget = {
      query: 'nintendo',
      hits: 1
    };

    const overrideTarget: OriginalTarget = {
      query: 'Brand',
      hits: 1
    };

    const mutableSchema = makeSchemaMutable(originalSchema);
    const mapper = schemaMapperFactory(mutableSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.$override(customSchema);
    expect(mapper(source, {})).toStrictEqual(overrideTarget);
  });
});
