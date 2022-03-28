import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';
import { MapperContext } from '../types/index';

export type Schema<Source = any, Target = any> = {
  [TargetKey in keyof Target]: SchemaTransformer<Source, Target, TargetKey>;
};

export type SchemaTransformer<Source, Target, TargetKey extends keyof Target> =
  | PropertyPath<Source>
  | ((source: Source, context?: MapperContext) => any)
  | Schema<Source, Exclude<Target[TargetKey], Function | Primitive>>
  | {
      $context?: MapperContext;
      $subschema: {
        [Path in PropertyPath<Source>]?:
          | Schema<PropertyType<Source, Path>, Target[TargetKey]>
          | '$self';
      };
    };

const source = {
  data: {
    a: 'a',
    b: 1
  },
  facets: {
    filter: 'Soy un filter',
    count: 10
  },
  lista: { asdf: 'primerElemento' }
};

type SourceTest = typeof source;

const filterSchema: Schema<SourceTest['facets'], TargetTest['filter']> = {
  value: param => ('filter' in param ? param.filter : null),
  num: 'count'
};

const schema: Schema<SourceTest, TargetTest> = {
  name: {
    title: ({ data: { a } }) => a
  },
  count: 'data.b',
  filter: {
    $subschema: {
      facets: filterSchema
    },
    $context: { miCosa: 'miCosa' }
  },
  otra: {
    cosa: 'lista.asdf',
    numero: 'facets.count',
    filter: {
      value: 'facets.filter',
      num: 'facets.count',
      $context: {}
    }
  }
};

type TargetTest = typeof destination;

const destination = {
  name: {
    title: 'a'
  },
  count: 1,
  filter: { value: 'Soy un filter', num: 10 },
  otra: {
    cosa: 'cosa',
    numero: 3,
    filter: { value: 'Soy un filter', num: 10 }
  }
};
