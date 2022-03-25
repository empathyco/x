import { PropertyPath, PropertyType } from '@empathyco/x-utils';

type Schema<Source, Target> = {
  [TargetKey in keyof Target]:
    | PropertyPath<Source>
    | Schema<Source, Target[TargetKey]>
    | ((source: Source) => any)
    | {
        [k in keyof SubSchema]: k extends 'schema'
          ?
              | Schema<
                  PropertyType<Source, PropertyPath<Source> & SubSchema['path']>,
                  Target[TargetKey]
                >
              | '$self'
          : SubSchema[k];
      };
};

/*
type SubSchema<Source, Target, Path = PropertyPath<Source>> = {
  path: Path;
  schema: Schema<PropertyType<Source, Path>, Target[TargetKey]> | '$self';
  context?: Schema<Source, any>;
};
*/

type SubSchema = {
  path: string;
  schema: any;
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
  }
};

type SourceTest = typeof source;

const filterSchema: Schema<SourceTest['facets'], TargetTest['filter']> = {
  value: 'filter',
  num: 'count'
};

const schema: Schema<SourceTest, TargetTest> = defineSchema({
  name: {
    title: 'data.a'
  },
  count: 'data.b',
  filter: {
    path: 'facets',
    schema: {
      value: 'filter',
      num: 'count'
    }
  }
});

type TargetTest = typeof destination;

const destination = {
  name: {
    title: 'a'
  },
  count: 1,
  filter: { value: 'Soy un filter', num: 10 }
};
