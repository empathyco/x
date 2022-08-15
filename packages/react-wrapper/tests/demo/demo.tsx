import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { SlotsComponentsView } from './views/slots-components.view';
import { SlotsView } from './views/slots.view';
import { ReactContextDemoView } from './views/react-context-demo.view';
import { UserContextProvider } from './contexts/user-context';

const views = {
  slots: SlotsView,
  slotsComponents: SlotsComponentsView,
  contextDemo: ReactContextDemoView
};

const url = new URL(location.href);
const viewName = url.searchParams.get('view') ?? 'default';

function App(): ReactElement {
  if (viewName in views) {
    const RouteComponent = views[viewName as keyof typeof views];

    return (
      <UserContextProvider>
        <RouteComponent />
      </UserContextProvider>
    );
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
