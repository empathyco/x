import { injectable } from 'inversify';
import { UserContextRequest } from '../../../types';
import { RequestMapper } from '../../empathy-adapter.types';
import { EmpathyUserInfoRequest } from '../../models/requests/empathy-discovery-wall.request';

@injectable()
export class EmpathyUserInfoMapper implements RequestMapper<UserContextRequest, EmpathyUserInfoRequest> {

  map({ userType, session, user }: UserContextRequest, request: EmpathyUserInfoRequest): EmpathyUserInfoRequest {
    return Object.assign<EmpathyUserInfoRequest, EmpathyUserInfoRequest>(request, {
        user,
        session,
        user_type: userType
      }
    );
  }
}
