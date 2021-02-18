import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { SlotsComponentsView } from './views/slots-components.view';
import { SlotsView } from './views/slots.view';

const views = {
  slots: SlotsView,
  slotsComponents: SlotsComponentsView
};

const url = new URL(location.href);
const viewName = url.searchParams.get('view') ?? 'default';

function App(): ReactElement {
  if (viewName in views) {
    const RouteComponent = views[viewName as keyof typeof views];
    return <RouteComponent />;
  }
  return <AvailableRoutes />;
}

function AvailableRoutes(): ReactElement {
  const availableRoutes = Object.keys(views);
  return (
    <nav>
      {availableRoutes.map(route => {
        return (
          <a key={route} href={`?view=${route}`}>
            {route}
          </a>
        );
      })}
    </nav>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
