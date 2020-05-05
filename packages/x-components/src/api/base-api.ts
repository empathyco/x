import { bus } from '../plugins/x-bus';
import { XAPI } from './api.types';

/**
 * Default implementation for {@link XAPI}.
 *
 * @public
 */
export class BaseXAPI implements XAPI {
  /**
   * Bus for emitting and listening events.
   *
   * @internal
   */
  protected bus = bus; // TODO Inject this constructor

  /**
   * Searches the query parameter as user query.
   *
   * @param query - Query to be searched.
   */
  search(query: string): void {
    // TODO - It should do more things like emit the query was changed out of the normal user flow
    this.bus.emit('UserAcceptedAQuery', query);
  }
}
