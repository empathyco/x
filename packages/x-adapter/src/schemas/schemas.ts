import { PropertyPath, PropertyType, Primitive } from '@empathyco/x-utils';

type Schema<Source, Target> = {
  [TargetKey in keyof Target]: PropertyPath<Source> | Target[TargetKey] extends Primitive
    ? PropertyPath<Source>
    :
        | Schema<Source, Target[TargetKey]>
        | {
            path: PropertyPath<Source>;
            schema: Schema<PropertyType<Source, PropertyPath<Source>>, Target[TargetKey]>;
          };
};

/*
type SubSchema<Source, Target, Path = PropertyPath<Source>> = {
  path: Path;
  schema: Schema<PropertyType<Source, Path>, Target[TargetKey]> | '$self';
  context?: Schema<Source, any>;
};
*/

type SubSchema<Source, Target, Path extends PropertyPath<Source>> = {
  path: Path;
  schema: Schema<PropertyType<Source, Path>, Target>;
  context?: any;
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
  lista: [{ asdf: 'primerElemento' }]
};

type SourceTest = typeof source;

const filterSchema: Schema<SourceTest['facets'], TargetTest['filter']> = {
  value: 'filter',
  num: 'count'
};

const schema: Schema<SourceTest, TargetTest> = {
  name: {
    title: 'data.a'
  },
  count: 'data.b',
  filter: {
    path: 'facets',
    schema: filterSchema
  },
  otra: {
    cosa: 'lista.0.asdf',
    numero: 'facets.count'
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
    numero: 3
  }
};
