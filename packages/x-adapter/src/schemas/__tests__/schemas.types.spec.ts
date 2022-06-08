import { Schema } from '../types';

describe('schema tests', () => {
  interface Source {
    q: string;
    count: number;
    list: string[];
  }

  interface Target {
    query: string;
    rows: number;
  }

  interface ComposedSource {
    response: Source;
  }

  interface ComposedTarget {
    request: Target;
    filter: string;
  }

  describe('Using schema with paths', () => {
    it('Renames source properties matching type paths', () => {
      const schema: Schema<Source, Target> = {
        query: 'q',
        // @ts-expect-error
        rows: 'q'
      };

      expect(typeof schema.query).toBe('string');
    });

    it('Allows to use path to access an array', () => {
      const schema: Schema<Source, Target> = {
        query: 'list.0',
        rows: 'count'
      };

      expect(typeof schema.rows).toBe('string');
    });
  });

  describe('Using schema with functions', () => {
    it('Allows to use function returning matching type', () => {
      const schema: Schema<Source, Target> = {
        rows: ({ q }) => Number(q),
        // @ts-expect-error
        query: () => 5
      };

      expect(typeof schema.rows).toBe('function');
    });
  });

  describe('Using schema with composed types', () => {
    it('Allows to use paths to inner properties', () => {
      const schema: Schema<ComposedSource, ComposedTarget> = {
        request: {
          query: 'response.q',
          // @ts-expect-error
          rows: 'count'
        },
        filter: 'response.list.0'
      };

      expect(typeof schema.request).toBe('object');
    });
  });

  describe('Using subSchema with composed types', () => {
    it('Allows to use paths to inner properties', () => {
      const subSchema: Schema<Source, Target> = {
        query: 'q',
        rows: 'count'
      };

      const schema: Schema<ComposedSource, ComposedTarget> = {
        request: {
          $path: 'response',
          $subSchema: subSchema
        },
        filter: 'response.list.0'
      };

      interface Pepe {
        pepe: number;
      }
      interface Maria {
        maria: string;
      }
      const wrongSubSchema: Schema<Pepe, Maria> = {
        maria: ({ pepe }) => String(pepe)
      };

      const otherSchema: Schema<ComposedSource, ComposedTarget> = {
        request: {
          // @ts-expect-error
          $path: 'response',
          // @ts-expect-error
          $subSchema: wrongSubSchema
        },
        filter: 'response.list.0'
      };

      expect(typeof schema.request).toBe('object');
      expect(typeof otherSchema.request).toBe('object');
    });
  });
});
