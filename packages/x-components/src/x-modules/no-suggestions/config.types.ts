import { PropsWithType } from '../../utils/types';
import { XEventsTypes } from '../../wiring/events.types';

/**
 * Event names of {@link XEventsTypes} available with an any array as payload.
 *
 * @public
 */
export type XEventArrayPayload = PropsWithType<XEventsTypes, any[]>;
