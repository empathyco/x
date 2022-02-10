import { injectable } from 'inversify';
import { TrackingRequest } from '../../types';
import { Requestor } from '../empathy-adapter.types';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class BeaconTrackingRequestor implements Requestor<TrackingRequest, Response | void> {
  private isAdblockPresent = false;

  constructor() {
    this.detectAdblock()
      .then(() => {
        this.isAdblockPresent = false;
      })
      .catch(() => {
        this.isAdblockPresent = true;
      });
  }

  request(trackingRequest: TrackingRequest): Promise<Response | void> {
    const url = this.buildUrl(trackingRequest);

    if (!this.isAdblockPresent && navigator.sendBeacon(url)) {
      return Promise.resolve();
    } else {
      if (this.isAdblockPresent) {
        return fetch(url);
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

  private detectAdblock(): Promise<Response | void> {
    const flaggedURL = 'https://google.com/pagead/js/adsbygoogle.js';

    if (!('fetch' in window)) {
      return Promise.resolve();
    }

    return fetch(
      new Request(flaggedURL, {
        method: 'HEAD',
        mode: 'no-cors'
      })
    );
  }
}
