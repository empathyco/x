'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('@empathyco/x-jest-utils');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function () {
  __assign =
    Object.assign ||
    function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
    };
  return __assign.apply(this, arguments);
};

/**
 * Jest schema for validating Identifiable entities.
 *
 * @public
 */
var IdentifiableSchema = {
  id: expect.anything()
};

/**
 * Jest schema for validating TaggingRequest entities.
 *
 * @public
 */
var TaggingRequestSchema = {
  params: expect.any(Object),
  url: expect.any(String)
};
/**
 * Jest schema for validating Tagging entities.
 *
 * @public
 */
var TaggingSchema = {
  add2cart: TaggingRequestSchema,
  checkout: TaggingRequestSchema,
  click: TaggingRequestSchema,
  query: TaggingRequestSchema
};
/**
 * Jest schema for validating Taggable entities.
 *
 * @public
 */
var TaggableSchema = {
  tagging: TaggingSchema
};

/**
 * Jest schema for validating Banner entities.
 *
 * @public
 */
var BannerSchema = __assign(__assign({}, IdentifiableSchema), {
  tagging: {
    click: TaggingRequestSchema
  },
  image: expect.any(String),
  modelName: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  position: expect.undefinedOr(Number)
});

/**
 * Jest schema for validating Filter entities.
 *
 * @public
 */
var FilterSchema = __assign(__assign({}, IdentifiableSchema), {
  modelName: expect.any(String),
  selected: expect.any(Boolean)
});
/**
 * Jest schema for validating FacetFilter entities.
 *
 * @public
 */
var FacetFilterSchema = __assign(__assign({}, FilterSchema), {
  facetId: expect.anyOf([Number, String]),
  modelName: expect.any(String)
});
/**
 * Jest schema for validating RawFilter entities.
 *
 * @public
 */
var RawFilterSchema = __assign(__assign({}, FilterSchema), {
  modelName: 'RawFilter',
  id: expect.any(String),
  selected: true
});
/**
 * Jest schema for validating BooleanFilter entities.
 *
 * @public
 */
var BooleanFilterSchema = __assign(__assign({}, FacetFilterSchema), {
  modelName: expect.any(String),
  label: expect.any(String),
  totalResults: expect.undefinedOr(Number)
});
/**
 * Jest schema for validating SimpleFilter entity.
 *
 * @public
 */
var SimpleFilterSchema = __assign(__assign({}, BooleanFilterSchema), { modelName: 'SimpleFilter' });
/**
 * Jest schema for validating HierarchicalFilter entity.
 *
 * @public
 */
var HierarchicalFilterSchema = __assign(__assign({}, BooleanFilterSchema), {
  parentId: expect.nullOrAnyOf([Number, String]),
  children: expect.undefinedOr(Array),
  modelName: 'HierarchicalFilter'
});
/**
 * Jest schema for validating NumberRangeFilter entity.
 *
 * @public
 */
var NumberRangeFilterSchema = __assign(__assign({}, BooleanFilterSchema), {
  range: { min: expect.nullOr(Number), max: expect.nullOr(Number) },
  modelName: 'NumberRangeFilter'
});
/**
 * Jest schema for validating EditableNumberRangeFilterSchema entity.
 *
 * @public
 */
var EditableNumberRangeFilterSchema = __assign(__assign({}, FacetFilterSchema), {
  range: { min: expect.nullOr(Number), max: expect.nullOr(Number) },
  modelName: 'EditableNumberRangeFilter'
});

/**
 * Jest schema for validating Facet entities.
 *
 * @public
 */
var FacetSchema = __assign(__assign({}, IdentifiableSchema), {
  label: expect.any(String),
  filters: expect.arrayOfItemsMatching(FilterSchema),
  modelName: expect.any(String)
});
/**
 * Jest schema for validating SimpleFacet entity.
 *
 * @public
 */
var SimpleFacetSchema = __assign(__assign({}, FacetSchema), {
  filters: expect.arrayOfItemsMatching(SimpleFilterSchema),
  modelName: 'SimpleFacet'
});
/**
 * Jest schema for validating HierarchicalFacet entity.
 *
 * @public
 */
var HierarchicalFacetSchema = __assign(__assign({}, FacetSchema), {
  filters: expect.arrayOfItemsMatching(HierarchicalFilterSchema),
  modelName: 'HierarchicalFacet'
});
/**
 * Jest schema for validating NumberRangeFacet entity.
 *
 * @public
 */
var NumberRangeFacetSchema = __assign(__assign({}, FacetSchema), {
  filters: expect.arrayOfItemsMatching(NumberRangeFilterSchema),
  modelName: 'NumberRangeFacet'
});
/**
 * Jest schema for validating EditableNumberRangeFacet entity.
 *
 * @public
 */
var EditableNumberRangeFacetSchema = __assign(__assign({}, FacetSchema), {
  filters: expect.arrayOfItemsMatching(EditableNumberRangeFilterSchema),
  modelName: 'EditableNumberRangeFacet'
});

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
var HistoryQuerySchema = {
  modelName: expect.any(String),
  query: expect.any(String),
  timestamp: expect.any(Number)
};

/**
 * Jest schema for validating Next query entities.
 *
 * @public
 */
var NextQuerySchema = {
  isCurated: expect.undefinedOr(Boolean),
  modelName: expect.any(String),
  query: expect.any(String),
  facets: expect.any(Array),
  totalResults: expect.any(Number),
  results: expect.any(Array)
};

/**
 * Jest schema for validating Promoted entities.
 *
 * @public
 */
var PromotedSchema = __assign(__assign({}, IdentifiableSchema), {
  tagging: {
    click: TaggingRequestSchema
  },
  image: expect.any(String),
  modelName: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  position: expect.undefinedOr(Number)
});

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
var RedirectionSchema = __assign(__assign({}, IdentifiableSchema), {
  tagging: {
    click: TaggingRequestSchema
  },
  modelName: 'Redirection',
  url: expect.any(String)
});

/**
 * Jest schema for validating Related Tag entities.
 *
 * @public
 */
var RelatedTagSchema = {
  isCurated: expect.undefinedOr(Boolean),
  modelName: expect.any(String),
  query: expect.any(String),
  tag: expect.any(String)
};

/**
 * Jest schema for validating Result entities.
 *
 * @public
 */
var ResultSchema = __assign(__assign({}, IdentifiableSchema), {
  identifier: {
    value: expect.any(String)
  },
  images: expect.arrayOf(String),
  modelName: expect.any(String),
  name: expect.any(String),
  price: {
    originalValue: expect.any(Number),
    value: expect.any(Number),
    hasDiscount: expect.any(Boolean)
  },
  rating: {
    value: expect.nullOr(Number)
  },
  tagging: {
    query: TaggingRequestSchema,
    click: TaggingRequestSchema,
    add2cart: TaggingRequestSchema,
    checkout: TaggingRequestSchema
  },
  type: expect.any(String),
  url: expect.any(String),
  isWishlisted: expect.any(Boolean)
});
/**
 * Jest schema for validating Recommendation (AKA Result) entities.
 *
 * @public
 */
var RecommendationSchema = __assign(__assign({}, IdentifiableSchema), {
  identifier: {
    value: expect.any(String)
  },
  images: expect.arrayOf(String),
  modelName: expect.any(String),
  name: expect.any(String),
  price: {
    originalValue: expect.any(Number),
    value: expect.any(Number),
    hasDiscount: expect.any(Boolean)
  },
  rating: {
    value: expect.nullOr(Number)
  },
  tagging: {
    click: TaggingRequestSchema,
    add2cart: TaggingRequestSchema,
    checkout: TaggingRequestSchema
  },
  type: expect.any(String),
  url: expect.any(String),
  isWishlisted: expect.any(Boolean)
});

/**
 * Jest schema for validating Suggestion entities.
 *
 * @public
 */
var SuggestionSchema = {
  modelName: expect.any(String),
  key: expect.any(String),
  query: expect.any(String)
};

exports.BannerSchema = BannerSchema;
exports.BooleanFilterSchema = BooleanFilterSchema;
exports.EditableNumberRangeFacetSchema = EditableNumberRangeFacetSchema;
exports.EditableNumberRangeFilterSchema = EditableNumberRangeFilterSchema;
exports.FacetFilterSchema = FacetFilterSchema;
exports.FacetSchema = FacetSchema;
exports.FilterSchema = FilterSchema;
exports.HierarchicalFacetSchema = HierarchicalFacetSchema;
exports.HierarchicalFilterSchema = HierarchicalFilterSchema;
exports.HistoryQuerySchema = HistoryQuerySchema;
exports.NextQuerySchema = NextQuerySchema;
exports.NumberRangeFacetSchema = NumberRangeFacetSchema;
exports.NumberRangeFilterSchema = NumberRangeFilterSchema;
exports.PromotedSchema = PromotedSchema;
exports.RawFilterSchema = RawFilterSchema;
exports.RecommendationSchema = RecommendationSchema;
exports.RedirectionSchema = RedirectionSchema;
exports.RelatedTagSchema = RelatedTagSchema;
exports.ResultSchema = ResultSchema;
exports.SimpleFacetSchema = SimpleFacetSchema;
exports.SimpleFilterSchema = SimpleFilterSchema;
exports.SuggestionSchema = SuggestionSchema;
exports.TaggableSchema = TaggableSchema;
exports.TaggingRequestSchema = TaggingRequestSchema;
exports.TaggingSchema = TaggingSchema;
