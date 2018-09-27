import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  SearchSession,
} from '../../../api/CrossProductSearchClient';
import { Scope } from '../../../api/types';
import { Result } from '../../../model/Result';
import { makeJiraObjectResult } from '../_test-util';

export function makeSingleResultCrossProductSearchResponse(
  scope: Scope,
  result?: Result,
): CrossProductSearchResults {
  const response = new Map();
  response.set(scope, [result || makeJiraObjectResult()]);
  return { results: response };
}

export const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
  },
  getAbTestData(searchSession: SearchSession) {
    return Promise.resolve(undefined);
  },
};

export const errorCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
  getAbTestData(searchSession: SearchSession) {
    return Promise.reject('error');
  },
};

export function singleResultCrossProductSearchClient(
  scope: Scope,
): CrossProductSearchClient {
  return {
    search(query: string) {
      return Promise.resolve(makeSingleResultCrossProductSearchResponse(scope));
    },
    getAbTestData(searchSession: SearchSession) {
      return Promise.resolve(undefined);
    },
  };
}
