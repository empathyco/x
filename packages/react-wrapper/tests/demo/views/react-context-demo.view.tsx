import React, { ReactElement } from 'react';
import { ReactUserContext} from '../stubs/react-user-context.stub';

export function ReactContextDemoView(): ReactElement {

  return (
    <div>
      <ReactUserContext/>
    </div>
  )
}