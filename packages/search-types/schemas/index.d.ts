/**
 * A banner is an image with a title, that when clicked redirect the user to an URL. Often it is
 * represented as a 100% wide element that appears on top of the results inside the grid or between
 * rows.
 *
 * @public
 */
declare interface Banner extends NamedModel<'Banner'>, Identifiable, Taggable {
  /** Banner title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Banner image. */
  image: string;
  /** Banner position (= row) inside the grid. */
  position?: number;
}

/**
 * Jest schema for validating Banner entities.
 *
 * @public
 */
export declare const BannerSchema: Banner;

/**
 * A boolean filter used in a {@link FacetFilter}, which status can be selected or not and
 * it may contains the total results number that the filter should return.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
declare interface BooleanFilter extends FacetFilter {
  /** Text to render the filter label. */
  label: string;
  /** Type to narrow {@link ModelNameType} from the extended Filter for the known subtypes. */
  modelName: BooleanFilterModelName;
  /** Amount of matching results. */
  totalResults?: number;
}

/**
 * Type to ease the usage of a model name in a {@link BooleanFilter} with autocomplete suggestions.
 *
 * @public
 */
declare type BooleanFilterModelName = typeof BooleanFilterModelNames[number];

/**
 * Const to use in the {@link BooleanFilterModelName} Type definition and also in Type Guards.
 *
 * @public
 */
declare const BooleanFilterModelNames: readonly [
  'SimpleFilter',
  'HierarchicalFilter',
  'NumberRangeFilter'
];

/**
 * Jest schema for validating BooleanFilter entities.
 *
 * @public
 */
export declare const BooleanFilterSchema: BooleanFilter;

/**
 * Editable Number Range Facet is a trait for filtering results using
 * user editable {@link RangeValue}.Editable means that the value max and min
 * can be changed by the user instead of havingseveral boolean filters with
 * different values. It extends from {@link Facet},changes the modelName and
 * uses {@link EditableNumberRangeFilter} as filters.
 *
 * @public
 */
declare interface EditableNumberRangeFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'EditableNumberRangeFacet';
  /** Filters available for the facet. */
  filters: EditableNumberRangeFilter[];
}

/**
 * Jest schema for validating EditableNumberRangeFacet entity.
 *
 * @public
 */
export declare const EditableNumberRangeFacetSchema: EditableNumberRangeFacet;

/**
 * A type of filter used in {@link EditableNumberRangeFacet} and extends from {@link FacetFilter}.
 * This filter has the particularity that its {@link RangeValue} is editable by the user.
 * Editable means that the value max and min can be changed by the user instead of having
 * several boolean filters with different values.
 *
 * @public
 */
declare interface EditableNumberRangeFilter extends FacetFilter {
  /** Model name to indicate the filter type. */
  modelName: 'EditableNumberRangeFilter';
  /** Filter range to use in the frontend. */
  range: RangeValue;
}

/**
 * Jest schema for validating EditableNumberRangeFilterSchema entity.
 *
 * @public
 */
export declare const EditableNumberRangeFilterSchema: EditableNumberRangeFilter;

/**
 * Facet is a trait for filtering results. It uses {@link Filter} as filters.
 *
 * @public
 */
declare interface Facet extends NamedModel<FacetModelName>, Identifiable {
  /** Filters available for the facet. */
  filters: Filter[];
  /** Label that represents the facet text. */
  label: string;
}

/**
 * A filter which is associated with a {@link Facet}.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
declare interface FacetFilter extends Filter {
  /**
   * The filter {@link ModelNameType | model name} excluding {@link RawFilter | RawFilter}
   * model name.
   */
  modelName: Exclude<FilterModelName, 'RawFilter'>;
  /** An unique ID that identifies the facet that uses this filter. */
  facetId: Facet['id'];
}

/**
 * Jest schema for validating FacetFilter entities.
 *
 * @public
 */
export declare const FacetFilterSchema: FacetFilter;

/**
 * Facets model names type. It can be: SimpleFacet, HierarchicalFacet, NumberRangeFacet
 * or EditableNumberRangeFacet.
 *
 * @public
 */
declare type FacetModelName =
  | 'SimpleFacet'
  | 'HierarchicalFacet'
  | 'NumberRangeFacet'
  | 'EditableNumberRangeFacet';

/**
 * Jest schema for validating Facet entities.
 *
 * @public
 */
export declare const FacetSchema: Facet;

/**
 * A basic filter.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
declare interface Filter extends NamedModel<FilterModelName>, Identifiable {
  /** Flag if the filter is selected or not. */
  selected: boolean;
}

/**
 * Filters model names type. It can be: {@link BooleanFilterModelName}, RawFilter
 * or EditableNumberRangeFilter.
 *
 * @public
 */
declare type FilterModelName = BooleanFilterModelName | 'EditableNumberRangeFilter' | 'RawFilter';

/**
 * Jest schema for validating Filter entities.
 *
 * @public
 */
export declare const FilterSchema: Filter;

/**
 * Hierarchical facet is a trait for filtering results. It extends from {@link Facet} changes the
 * modelName and uses {@link HierarchicalFilter} as filters.
 *
 * @public
 */
declare interface HierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet';
  /** Filters available for the facet. */
  filters: HierarchicalFilter[];
}

/**
 * Jest schema for validating HierarchicalFacet entity.
 *
 * @public
 */
export declare const HierarchicalFacetSchema: HierarchicalFacet;

/**
 * A type of filter used in {@link HierarchicalFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that it has recursive children.
 *
 * @public
 */
declare interface HierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter';
  /** A unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null;
  /** Descendants filters. */
  children?: HierarchicalFilter[];
}

/**
 * Jest schema for validating HierarchicalFilter entity.
 *
 * @public
 */
export declare const HierarchicalFilterSchema: HierarchicalFilter;

/**
 * Represents a query that has been made by the user.
 *
 * @public
 */
declare interface HistoryQuery extends Previewable, NamedModel<'HistoryQuery'> {
  /** Timestamp when the history query was created. */
  timestamp: number;
}

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
export declare const HistoryQuerySchema: HistoryQuery;

/**
 * Represents an Object with id property.
 *
 * @public
 */
declare interface Identifiable<ID = string | number> {
  /** A unique ID that identifies the Object. */
  id: ID;
}

/**
 * Type to ease the usage of the ModelNames interface with autocomplete suggestions.
 *
 * @public
 */
declare type ModelNameType =
  | 'Result'
  | 'NextQueries'
  | 'NextQuery'
  | 'RelatedTag'
  | 'PopularSearch'
  | 'QuerySuggestion'
  | 'HistoryQuery'
  | 'Banner'
  | 'Promoted'
  | 'Redirection'
  | FilterModelName
  | FacetModelName
  | string;

/**
 * Common interface to ease the differentiate between different model types.
 *
 * @public
 */
declare interface NamedModel<T extends ModelNameType = ModelNameType> {
  /** The {@link ModelNameType | model name} value. */
  readonly modelName: T;
}

/**
 * A next query is a suggestion of a new query that the user may be interested after searching
 * for an specific term.
 *
 * @public
 */
declare interface NextQuery extends NamedModel<'NextQuery'>, Required<Previewable> {
  /** If it's a curated next query. */
  isCurated?: boolean;
}

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
export declare const NextQuerySchema: NextQuery;

/**
 * Number Range Facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link NumberRangeFilter} as filters.
 *
 * @public
 */
declare interface NumberRangeFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'NumberRangeFacet';
  /** Filters available for the facet. */
  filters: NumberRangeFilter[];
}

/**
 * Jest schema for validating NumberRangeFacet entity.
 *
 * @public
 */
export declare const NumberRangeFacetSchema: NumberRangeFacet;

/**
 * A type of filter used in {@link NumberRangeFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that its range property is an object with a range of numbers.
 * The difference with {@link EditableNumberRangeFilter} is that range's values are not editable.
 * There are different NumberRangeFilters within the facet to cover different predefined range
 * options.
 *
 * @public
 */
declare interface NumberRangeFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'NumberRangeFilter';
  /** Filter range to use in the frontend. */
  range: RangeValue;
}

/**
 * Jest schema for validating NumberRangeFilter entity.
 *
 * @public
 */
export declare const NumberRangeFilterSchema: NumberRangeFilter;

/**
 * Represents an item that is searchable, and the results associated to it.
 *
 * @public
 */
declare interface Previewable {
  /** The query to search for. */
  query: string;
  /** Facets to apply to the `query` property when searching. */
  facets?: Facet[];
  /** The results that the combination of `query` and `facets` properties return, or `null` if
   * they have not been loaded yet. */
  results?: Result[] | null;
  /** The number of results that the combination of `query` and `facets` properties return, or
   * `null` if they have not been loaded yet. */
  totalResults?: number | null;
}

/**
 * A promoted is an image with a title, that when clicked redirect the user to an URL.
 * Often it is represented taking up the same space than a normal result.
 *
 * @public
 */
declare interface Promoted extends NamedModel<'Promoted'>, Identifiable, Taggable {
  /** Promoted title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Promoted image. */
  image: string;
  /** Promoted position inside the grid. */
  position?: number;
}

/**
 * Jest schema for validating Promoted entities.
 *
 * @public
 */
export declare const PromotedSchema: Promoted;

/**
 * A numeric range filter value.
 *
 * @public
 */
declare interface RangeValue {
  /** The minimum value allowed. `null` means unset. */
  min: number | null;
  /** The maximum value allowed. `null` means unset. */
  max: number | null;
}

/**
 * A filter which id is the value of the filter. It can be selected or not.
 *
 * @public
 */
declare interface RawFilter extends Filter {
  /** The value of the filter. */
  id: string;
  /** Model name to indicate the filter type. */
  modelName: 'RawFilter';
  /** Force {@link Filter | Filter} `selected` property to true. */
  selected: true;
}

/**
 * Jest schema for validating RawFilter entities.
 *
 * @public
 */
export declare const RawFilterSchema: RawFilter;

/**
 * Jest schema for validating Recommendation (AKA Result) entities.
 *
 * @public
 */
export declare const RecommendationSchema: Result;

/**
 * A redirection (AKA Direct Link) is simply a URL.
 * Normally, the user is just redirected to it after making a query that matches the
 * configuration of this URL. In other cases it is shown as a button that the user can click,
 * and which will trigger the redirect action.
 *
 * @public
 */
declare interface Redirection extends NamedModel<'Redirection'>, Identifiable, Taggable {
  /** URL to redirect. */
  url: string;
}

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
export declare const RedirectionSchema: Redirection;

/**
 * A related tag is just a term that refines the current query.
 *
 * @public
 */
declare interface RelatedTag extends NamedModel<'RelatedTag'>, Previewable {
  /** If it's a curated related tag. */
  isCurated?: boolean;
  /** The term to add to the current query. */
  tag: string;
}

/**
 * Jest schema for validating Related Tag entities.
 *
 * @public
 */
export declare const RelatedTagSchema: RelatedTag;

/**
 * A search result.
 *
 * @public
 */
declare interface Result extends NamedModel<'Result'>, Identifiable, Taggable {
  /** The type of the result: product, article, pack, etc... */
  type?: string;
  /** Images of the result. It should be the URLs. */
  images?: string[];
  /** Result name. */
  name?: string;
  /** {@link ResultPrice | Result price}.  */
  price?: ResultPrice;
  /** {@link ResultRating | Result rating}.  */
  rating?: ResultRating;
  /** {@link ResultIdentifier | Result identifier}.  */
  identifier?: ResultIdentifier;
  /** Result URL to redirect to PDP.  */
  url?: string;
  /** Flag if the results has been added to the wishlist or not. */
  isWishlisted?: boolean;
  /** {@link ResultVariant | Variants of the result}.  */
  variants?: ResultVariant[];
}

/**
 * The client result identifier (SKU, MOCACO, a simple ID...).
 *
 * @public
 */
declare interface ResultIdentifier {
  /** Result identifier value. */
  value: string;
}

/**
 * The result price.
 *
 * @public
 */
declare interface ResultPrice {
  /** The old value. */
  originalValue: number;
  /** The current value. */
  value: number;
  /** Whether or not this result has discount. */
  hasDiscount: boolean;
}

/**
 * The result rating.
 *
 * @public
 */
declare interface ResultRating {
  /** The value of the rating. `null` means unset. */
  value: number | null;
}

/**
 * Jest schema for validating Result entities.
 *
 * @public
 */
export declare const ResultSchema: Result;

/**
 * A result variant.
 *
 * @public
 */
declare interface ResultVariant extends Omit<Result, 'id' | 'modelName' | 'tagging'> {}

/**
 * Simple facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link SimpleFilter} as filters.
 *
 * @public
 */
declare interface SimpleFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'SimpleFacet';
  /** Filters available for the facet. */
  filters: SimpleFilter[];
}

/**
 * Jest schema for validating SimpleFacet entity.
 *
 * @public
 */
export declare const SimpleFacetSchema: SimpleFacet;

/**
 * A type of filter used in {@link SimpleFacet} and extends from {@link Filter}.
 * It can be selected or not.
 *
 * @public
 */
declare interface SimpleFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'SimpleFilter';
}

/**
 * Jest schema for validating SimpleFilter entity.
 *
 * @public
 */
export declare const SimpleFilterSchema: SimpleFilter;

/**
 * A suggestion represents a query that has been proposed to the user, due of being popular,
 * matching with the current search query...
 *
 * @public
 */
declare interface Suggestion extends NamedModel<'QuerySuggestion' | 'PopularSearch'>, Previewable {
  /** If it's a curated suggestion. */
  isCurated?: boolean;
  /**
   * Unique identifier of the suggestion.
   *
   * @deprecated - The key field should be calculated if needed using the `query` and the
   * `facets` properties.
   */
  key: string;
}

/**
 * Jest schema for validating Suggestion entities.
 *
 * @public
 */
export declare const SuggestionSchema: Suggestion;

/**
 * A taggable entity.
 *
 * @public
 */
declare interface Taggable {
  /** Tagging object containing the different taggable events. */
  tagging?: Tagging;
}

/**
 * Jest schema for validating Taggable entities.
 *
 * @public
 */
export declare const TaggableSchema: Taggable;

/**
 * The tagging user actions.
 *
 * @public
 */
declare interface Tagging {
  /** {@link TaggingRequest | add to cart tagging}. */
  add2cart?: TaggingRequest;
  /** {@link TaggingRequest | checkout tagging}. */
  checkout?: TaggingRequest;
  /** {@link TaggingRequest | click tagging}. */
  click?: TaggingRequest;
  /** {@link TaggingRequest | query tagging}. */
  query?: TaggingRequest;
  /** {@link TaggingRequest | wishlist tagging}. */
  wishlist?: TaggingRequest;
  /** Any other {@link TaggingRequest | tagging } key-value. */
  [key: string]: TaggingRequest | undefined;
}

/**
 * The request for the tagging API.
 *
 * @public
 */
declare interface TaggingRequest {
  /** Tagging URL. */
  url: string;
  /** Params of the tagging URL. */
  params: Record<string, string | number | boolean>;
}

/**
 * Jest schema for validating TaggingRequest entities.
 *
 * @public
 */
export declare const TaggingRequestSchema: TaggingRequest;

/**
 * Jest schema for validating Tagging entities.
 *
 * @public
 */
export declare const TaggingSchema: Tagging;

export {};
