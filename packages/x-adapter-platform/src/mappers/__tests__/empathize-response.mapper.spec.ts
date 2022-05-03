import { empathizeResponseMapper } from '../response/empathize-response.mapper';
import { EmpathizeResponse, PlatformEmpathizeResponse } from '../../types';

describe('empathize response mapper tests', () => {
  it('should map the popular searches', () => {
    const platformEmpathizeResponse: PlatformEmpathizeResponse = {
      topTrends: {
        content: [{ title_raw: 'sandal' }, { title_raw: 'sock' }, { title_raw: 'saree' }]
      }
    };

    const empathizeResponse: EmpathizeResponse = {
      suggestions: [
        {
          query: 'sandal',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'sandal'
        },
        {
          query: 'sock',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'sock'
        },
        {
          query: 'saree',
          isCurated: false,
          facets: [],
          modelName: 'PopularSearch',
          key: 'saree'
        }
      ]
    };
    expect(empathizeResponseMapper(platformEmpathizeResponse, {})).toStrictEqual(empathizeResponse);
  });

  it('should map the query suggestions', () => {
    const platformEmpathizeResponse: PlatformEmpathizeResponse = {
      topTrends: {
        content: [{ title_raw: 'sandal' }, { title_raw: 'sock' }, { title_raw: 'saree' }]
      }
    };

    const empathizeResponse: EmpathizeResponse = {
      suggestions: [
        {
          query: 'sandal',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sandal'
        },
        {
          query: 'sock',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'sock'
        },
        {
          query: 'saree',
          isCurated: false,
          facets: [],
          modelName: 'QuerySuggestion',
          key: 'saree'
        }
      ]
    };
    expect(
      empathizeResponseMapper(platformEmpathizeResponse, { requestParameters: { query: 'shoes' } })
    ).toStrictEqual(empathizeResponse);
  });
});
