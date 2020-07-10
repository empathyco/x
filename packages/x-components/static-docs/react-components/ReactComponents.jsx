import 'reflect-metadata';
import { installX } from '@empathy/x-components';
import { NextQueries } from '@empathy/x-components/next-queries';
import { QuerySuggestions } from '@empathy/x-components/query-suggestions';
import React from 'react';
import { SearchInput, ClearSearchInput, SearchButton } from '@empathy/x-components/search-box';
import { ReactWrapper } from '@empathy/react-wrapper';
import { EmpathyAdapterBuilder } from '@empathy/search-adapter';

if (typeof window !== 'undefined' && window.localStorage) {
  const adapter = new EmpathyAdapterBuilder()
    .withConfiguration({ instance: 'juguettos', env: 'staging' })
    .setLang('es')
    .build();
  installX({ adapter });
}

export function ReactSearchInput(props) {
  return <ReactWrapper component={SearchInput} {...props} />;
}

export function ReactClearSearchInput(props) {
  return <ReactWrapper component={ClearSearchInput} {...props} />;
}

export function ReactSearchButton(props) {
  return <ReactWrapper component={SearchButton} {...props} />;
}

export function ReactNextQueries(props) {
  return <ReactWrapper component={NextQueries} {...props} on={{}} />;
}

export function ReactQuerySuggestions(props) {
  return <ReactWrapper component={QuerySuggestions} {...props} on={{}} />;
}

export function doMagic() {
  return alert('Magic!');
}
