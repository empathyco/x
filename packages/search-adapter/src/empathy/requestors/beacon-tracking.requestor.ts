import { injectable } from 'inversify';
import { TrackingRequest } from '../../types';
import { Requestor } from '../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class BeaconTrackingRequestor implements Requestor<TrackingRequest, void> {

  request(trackingRequest: TrackingRequest): Promise<void> {
    const url = this.buildUrl(trackingRequest);

    if (navigator.sendBeacon(url)) {
      return Promise.resolve();
    } else {
      return Promise.reject('Beacon not queued');
    }
  }

  private buildUrl(trackingRequest: TrackingRequest): string {
    const url = new URL(trackingRequest.url);
    Object.entries(trackingRequest.params).forEach(([key, value]) => url.searchParams.append(key, value));
    return url.href;
  }
}
