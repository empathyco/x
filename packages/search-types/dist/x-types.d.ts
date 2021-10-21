/**
 * A banner is an image with a title, that when clicked redirect the user to an URL. Often it is
 * represented as a 100% wide element that appears on top of the results inside the grid or between
 * rows.
 *
 * @public
 */
export declare interface Banner extends NamedModel<'Banner'>, Identifiable {
  /** Banner title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Banner image. */
  image: string;
  /** Banner tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}

/**
 * A boolean filter used in a {@link FacetFilter}, which status can be selected or not and
 * it may contains the total results number that the filter should return.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
export declare interface BooleanFilter extends FacetFilter {
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
export declare type BooleanFilterModelName = typeof BooleanFilterModelNames[number];

/**
 * Const to use in the {@link BooleanFilterModelName} Type definition and also in Type Guards.
 */
export declare const BooleanFilterModelNames: readonly [
  'SimpleFilter',
  'HierarchicalFilter',
  'NumberRangeFilter'
];

/**
 * Editable Number Range Facet is a trait for filtering results using
 * user editable {@link RangeValue}.Editable means that the value max and min
 * can be changed by the user instead of havingseveral boolean filters with
 * different values. It extends from {@link Facet},changes the modelName and
 * uses {@link EditableNumberRangeFilter} as filters.
 *
 * @public
 */
export declare interface EditableNumberRangeFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'EditableNumberRangeFacet';
  /** Filters available for the facet. */
  filters: EditableNumberRangeFilter[];
}

/**
 * A type of filter used in {@link EditableNumberRangeFacet} and extends from {@link FacetFilter}.
 * This filter has the particularity that its {@link RangeValue} is editable by the user.
 * Editable means that the value max and min can be changed by the user instead of having
 * several boolean filters with different values.
 *
 * @public
 */
export declare interface EditableNumberRangeFilter extends FacetFilter {
  /** Model name to indicate the filter type. */
  modelName: 'EditableNumberRangeFilter';
  /** Filter range to use in the frontend. */
  range: RangeValue;
}

/**
 * Facet is a trait for filtering results. It uses {@link Filter} as filters.
 *
 * @public
 */
export declare interface Facet extends NamedModel<FacetModelName>, Identifiable {
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
export declare interface FacetFilter extends Filter {
  /**
   * The filter {@link ModelNameType | model name} excluding {@link RawFilter#modelName | RawFilter}
   * model name.
   */
  modelName: Exclude<FilterModelName, 'RawFilter'>;
  /** An unique ID that identifies the facet that uses this filter. */
  facetId: Facet['id'];
}

/**
 * Facets model names type. It can be: SimpleFacet, HierarchicalFacet, NumberRangeFacet
 * or EditableNumberRangeFacet.
 *
 * @public
 */
export declare type FacetModelName =
  | 'SimpleFacet'
  | 'HierarchicalFacet'
  | 'NumberRangeFacet'
  | 'EditableNumberRangeFacet';

/**
 * A basic filter.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
export declare interface Filter extends NamedModel<FilterModelName>, Identifiable {
  /** Flag if the filter is selected or not. */
  selected: boolean;
}

/**
 * Filters model names type. It can be: {@link BooleanFilterModelName}, RawFilter
 * or EditableNumberRangeFilter.
 *
 * @public
 */
export declare type FilterModelName =
  | BooleanFilterModelName
  | 'EditableNumberRangeFilter'
  | 'RawFilter';

/**
 * Hierarchical facet is a trait for filtering results. It extends from {@link Facet} changes the
 * modelName and uses {@link HierarchicalFilter} as filters.
 */
export declare interface HierarchicalFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'HierarchicalFacet';
  /** Filters available for the facet. */
  filters: HierarchicalFilter[];
}

/**
 * A type of filter used in {@link HierarchicalFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that it has recursive children.
 *
 * @public
 */
export declare interface HierarchicalFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'HierarchicalFilter';
  /** An unique id used to reference the parent filter or null if it hasn't. */
  parentId: Filter['id'] | null;
  /** Descendants filters id. */
  children?: Filter['id'][];
}

/**
 * Represents a query that has been made by the user.
 *
 * @public
 */
export declare interface HistoryQuery extends Previewable, NamedModel<'HistoryQuery'> {
  /** Timestamp when the history query was created. */
  timestamp: number;
}

/**
 * Represents an Object with id property.
 *
 * @public
 */
export declare interface Identifiable {
  /** A unique ID that identifies the Object. */
  id: string | number;
}

/**
 * Type guard to check if a filter is a {@link BooleanFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link BooleanFilter}, false otherwise.
 *
 * @public
 */
export declare function isBooleanFilter(filter: Filter): filter is BooleanFilter;

/**
 * Type guard to check if a facet is an {@link EditableNumberRangeFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns A boolean that represents if a facet is an {@link EditableNumberRangeFacet}.
 *
 * @public
 */
export declare function isEditableNumberRangeFacet(facet: Facet): facet is EditableNumberRangeFacet;

/**
 * Type guard to check if a filter is an {@link EditableNumberRangeFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is an {@link EditableNumberRangeFilter}, false otherwise.
 *
 * @public
 */
export declare function isEditableNumberRangeFilter(
  filter: Filter
): filter is EditableNumberRangeFilter;

/**
 * Type guard to check if a filter is a {@link FacetFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns  True if the filter is a {@link FacetFilter}, false otherwise.
 *
 * @public
 */
export declare function isFacetFilter(filter: Filter): filter is FacetFilter;

/**
 * Type guard to check if a facet is an {@link HierarchicalFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link HierarchicalFacet}, false otherwise.
 *
 * @public
 */
export declare function isHierarchicalFacet(facet: Facet): facet is HierarchicalFacet;

/**
 * Type guard to check if a filter is a {@link HierarchicalFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link HierarchicalFilter}, false otherwise.
 *
 * @public
 */
export declare function isHierarchicalFilter(filter: Filter): filter is HierarchicalFilter;

/**
 * Type guard to check if a facet is an {@link NumberRangeFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link NumberRangeFacet}, false otherwise.
 *
 * @public
 */
export declare function isNumberRangeFacet(facet: Facet): facet is NumberRangeFacet;

/**
 * Type guard to check if a filter is a {@link NumberRangeFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link NumberRangeFilter}, false otherwise.
 *
 * @public
 */
export declare function isNumberRangeFilter(filter: Filter): filter is NumberRangeFilter;

/**
 * Type guard to check if a filter is a {@link RawFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link RawFilter}, false otherwise.
 *
 * @public
 */
export declare function isRawFilter(filter: Filter): filter is RawFilter;

/**
 * Type guard to check if a facet is an {@link SimpleFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns True if the facet is a {@link SimpleFacet}, false otherwise.
 *
 * @public
 */
export declare function isSimpleFacet(facet: Facet): facet is SimpleFacet;

/**
 * Type guard to check if a filter is a {@link SimpleFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link SimpleFilter}, false otherwise.
 *
 * @public
 */
export declare function isSimpleFilter(filter: Filter): filter is SimpleFilter;

/**
 * Type to ease the usage of the ModelNames interface with autocomplete suggestions.
 *
 * @public
 */
export declare type ModelNameType =
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
export declare interface NamedModel<T extends ModelNameType = ModelNameType> {
  /** The {@link ModelNameType | model name} value. */
  readonly modelName: T;
}

/**
 * A group of next queries.
 *
 * @public
 */
export declare interface NextQueries extends NamedModel<'NextQueries'>, Identifiable {
  /** Array of next queries available inside the group. */
  nextQueries: NextQuery[];
}

/**
 * A next query is a suggestion of a new query that the user may be interested after searching
 * for an specific term.
 *
 * @public
 */
export declare interface NextQuery extends NamedModel<'NextQuery'>, Required<Previewable> {}

/**
 * Number Range Facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link NumberRangeFilter} as filters.
 *
 * @public
 */
export declare interface NumberRangeFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'NumberRangeFacet';
  /** Filters available for the facet. */
  filters: NumberRangeFilter[];
}

/**
 * A type of filter used in {@link NumberRangeFacet} and extends from {@link BooleanFilter}.
 * This filter has the particularity that its range property is an object with a range of numbers.
 * The difference with {@link EditableNumberRangeFilter} is that range's values are not editable.
 * There are different NumberRangeFilters within the facet to cover different predefined range
 * options.
 *
 * @public
 */
export declare interface NumberRangeFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'NumberRangeFilter';
  /** Filter range to use in the frontend. */
  range: RangeValue;
}

/**
 * A partial result represents a sub-query of a user search term which normally has not enough
 * results (or not results at all).
 * It includes a preview of these results and the number of total results that match against the
 * sub-query.
 *
 * @public
 */
export declare interface PartialResult extends Previewable {
  /** {@inheritDoc Previewable.results} */
  results: Result[] | null;
  /** {@inheritDoc Previewable.totalResults} */
  totalResults: number | null;
}

/**
 * Represents an item that is searchable, and the results associated to it.
 *
 * @public
 */
export declare interface Previewable {
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
export declare interface Promoted extends NamedModel<'Promoted'>, Identifiable {
  /** Promoted title. */
  title: string;
  /** URL to redirect. */
  url: string;
  /** Promoted image. */
  image: string;
  /** Promoted tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}

/**
 * A numeric range filter value.
 *
 * @public
 */
export declare interface RangeValue {
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
export declare interface RawFilter extends Filter {
  /** The value of the filter. */
  id: string;
  /** Model name to indicate the filter type. */
  modelName: 'RawFilter';
  /** Force {@link Filter#selected | Filter selected} property to true. */
  selected: true;
}

/**
 * A redirection (AKA Direct Link) is simply a URL.
 * Normally, the user is just redirected to it after making a query that matches the
 * configuration of this URL. In other cases it is shown as a button that the user can click,
 * and which will trigger the redirect action.
 *
 * @public
 */
export declare interface Redirection extends NamedModel<'Redirection'>, Identifiable {
  /** URL to redirect. */
  url: string;
  /** Redirect tagging. */
  tagging: {
    /** {@link Tagging | Click tagging}. */
    click: Tagging;
  };
}

/**
 * A related tag is just a term that refines the current query.
 *
 * @public
 */
export declare interface RelatedTag extends NamedModel<'RelatedTag'>, Previewable {
  /** The term to add to the current query. */
  tag: string;
  /** If selection mode is enabled, tells if this related tag is selected or not. */
  selected: boolean;
  /** The query to refine. */
  previous: string;
}

/**
 * A search result.
 *
 * @public
 */
export declare interface Result extends NamedModel<'Result'>, Identifiable {
  /** The type of the result: product, article, pack, etc... */
  type: string;
  /** Images of the result. It should be the URLs. */
  images: string[];
  /** Result name. */
  name: string;
  /** Minimum age use of the result. */
  minAge: number;
  /** Max age use of the result. */
  maxAge: number;
  /** Unit for the ages in the result. */
  unitAge: string;
  /** Brands associated with the result. */
  brands: string[];
  /** Categories associated with the result. */
  categories: string[];
  /** {@link ResultPrice | Result price}.  */
  price: ResultPrice;
  /** {@link ResultRating | Result rating}.  */
  rating: ResultRating;
  /** {@link ResultTagging | Result tagging}.  */
  tagging: ResultTagging;
  /** {@link ResultIdentifier | Result identifier}.  */
  identifier: ResultIdentifier;
  /** Result URL to redirect to PDP.  */
  url: string;
  /** Flag if the results has been added to the wishlist or not. */
  isWishlisted: boolean;
}

/**
 * The client result identifier (SKU, MOCACO, a simple ID...).
 *
 * @public
 */
export declare interface ResultIdentifier {
  /** Result identifier value. */
  value: string;
}

/**
 * The result price.
 *
 * @public
 */
export declare interface ResultPrice {
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
export declare interface ResultRating {
  /** The value of the rating. `null` means unset. */
  value: number | null;
}

/**
 * The result tagging events.
 *
 * @public
 */
export declare interface ResultTagging {
  /** {@link Tagging | click tagging}. */
  click: Tagging;
  /** {@link Tagging | add to cart tagging}. */
  add2cart: Tagging;
  /** {@link Tagging | checkout tagging}. */
  checkout: Tagging;
  /** Any other {@link Tagging | tagging } key-value. */
  [key: string]: Tagging;
}

/**
 * Simple facet is a trait for filtering results. It extends from {@link Facet}, changes the
 * modelName and uses {@link SimpleFilter} as filters.
 *
 * @public
 */
export declare interface SimpleFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'SimpleFacet';
  /** Filters available for the facet. */
  filters: SimpleFilter[];
}

/**
 * A type of filter used in {@link SimpleFacet} and extends from {@link Filter}.
 * It can be selected or not.
 *
 * @public
 */
export declare interface SimpleFilter extends BooleanFilter {
  /** Model name to indicate the filter type. */
  modelName: 'SimpleFilter';
}

/**
 * The Sort model represents a way of arranging a list of items.
 *
 * @public
 */
export declare type Sort = string;

/**
 * A suggestion represents a query that has been proposed to the user, due of being popular,
 * matching with the current search query...
 *
 * @public
 */
export declare interface Suggestion
  extends NamedModel<'QuerySuggestion' | 'PopularSearch'>,
    Previewable {
  /** {@inheritDoc Previewable.facets} */
  facets: Facet[];
  /**
   * Unique identifier of the suggestion.
   *
   * @deprecated - The key field should be calculated if needed using the `query` and the
   * `facets` properties.
   */
  key: string;
}

/**
 * The tagging model is a URL with a record of parameters. This tagging is used to track user
 * actions (query, click, show...) by making a request with these info.
 *
 * @public
 */
export declare interface Tagging {
  /** Tagging URL. */
  url: string;
  /** Params of the tagging URL. */
  params: Record<string, any>;
}

/**
 * The representation of the user.
 *
 * @public
 */
export declare interface UserInfo {
  /** A unique token that represents the user over a long period of time. */
  user: string;
  /** A unique token that represents a search session. */
  session: string;
  /** Whether the user is new or recurrent. */
  userType: string;
}

export {};
