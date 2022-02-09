import { injectable } from 'inversify';
import { TrackingRequest } from '../../types';
import { Requestor } from '../empathy-adapter.types';

let isAdblockPresent = false;
detectAdblock()
  .then(() => (isAdblockPresent = false))
  .catch(() => (isAdblockPresent = true));

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class BeaconTrackingRequestor implements Requestor<TrackingRequest, void> {
  request(trackingRequest: TrackingRequest): Promise<void> {
    const url = this.buildUrl(trackingRequest);

    if (!isAdblockPresent && navigator.sendBeacon(url)) {
      return Promise.resolve();
    } else {
      if (isAdblockPresent) {
        fetch(url);
      }
      return Promise.reject('Beacon not queued');
    }
  }

  private buildUrl(trackingRequest: TrackingRequest): string {
    const url = new URL(trackingRequest.url);
    Object.entries(trackingRequest.params).forEach(([key, value]) =>
      url.searchParams.append(key, value)
    );
    return url.href;
  }
}

function detectAdblock(): Promise<Response | void> {
  const flaggedURL = 'https://google.com/pagead/js/adsbygoogle.js';

  if (!fetch) {
    return Promise.resolve();
  }

  return fetch(
    new Request(flaggedURL, {
      method: 'HEAD',
      mode: 'no-cors'
    })
  );
}
