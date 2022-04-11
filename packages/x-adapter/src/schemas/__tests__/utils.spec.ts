import { Schema } from '../schemas.types';
import { makeSchemaMutable } from '../utils';
import { schemaMapperFactory } from '../../mappers';

describe('MutableSchemas', () => {
  interface Facet {
    id: string;
    label: string;
    count: number;
  }

  interface Source {
    q: string;
    rows: number;
    facets: Facet[];
  }

  interface Target {
    query: string;
    hits: number;
  }

  it('Creates a mutable schema', () => {
    const originalSchema: Schema<Source, Target> = {
      query: 'q',
      hits: 'rows'
    };
    const mutableSchema = makeSchemaMutable(originalSchema);
    expect(mutableSchema.query).toBe('q');
    expect(mutableSchema.hits).toBe('rows');
    expect(mutableSchema.override).toBeTruthy();
    expect(mutableSchema.replace).toBeTruthy();
  });

  it('should replace a schema with a new one', () => {
    const source: Source = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const originalSchema: Schema<Source, Target> = {
      query: 'q',
      hits: 'rows'
    };

    const replaceSchema: Schema<Source, Target> = {
      query: 'facets.0.label',
      hits: 'facets.0.count'
    };

    const originalTarget: Target = {
      query: 'nintendo',
      hits: 1
    };

    const replaceTarget: Target = {
      query: 'Brand',
      hits: 99
    };

    const mapper = schemaMapperFactory(originalSchema);
    const mutableSchema = makeSchemaMutable(originalSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.replace(replaceSchema);
    expect(mapper(source, {})).toStrictEqual(replaceTarget);
  });

  it('should override the original schema', () => {
    const source: Source = {
      q: 'nintendo',
      rows: 1,
      facets: [{ id: 'brand', count: 99, label: 'Brand' }]
    };

    const originalSchema: Schema<Source, Target> = {
      query: 'q',
      hits: 'rows'
    };

    const overrideSchema: Partial<Schema<Source, Target>> = {
      query: 'facets.0.label'
    };

    const originalTarget: Target = {
      query: 'nintendo',
      hits: 1
    };

    const overrideTarget: Target = {
      query: 'Brand',
      hits: 1
    };

    const mapper = schemaMapperFactory(originalSchema);
    const mutableSchema = makeSchemaMutable(originalSchema);
    expect(mapper(source, {})).toStrictEqual(originalTarget);

    mutableSchema.override(overrideSchema);
    expect(mapper(source, {})).toStrictEqual(overrideTarget);
  });
});
