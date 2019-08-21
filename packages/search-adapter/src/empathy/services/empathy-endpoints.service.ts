import { inject, injectable } from 'inversify';
import { EmpathyAdapterConfig } from '../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../container/container.const';
import { EndpointsService } from './endpoints-service.types';

@injectable()
export class EmpathyEndpointsService implements EndpointsService {

  constructor(
    @inject(DEPENDENCIES.config) private readonly config: EmpathyAdapterConfig
  ) {}

  buildUrl(rawUrl: string): string {
    if (!rawUrl.startsWith('http')) {
      rawUrl = `https://${ rawUrl }`;
    }

    return rawUrl
      .replace(/{env}/g, this.config.env === 'live' ? '' : `-${ this.config.env }`)
      .replace(/{instance}/g, this.config.instance);
  }
}
