import { Logger } from 'winston';
import { PartnerApiKey } from '../types/partnerInfo';
import { APIEndPoint } from './getLogicalEndpointNameFor';
import { createFunctionLogger } from '../../logger/createFunctionLogger';
import { getPermissionModel } from '../permissions/getPermissionModel';
import { getPermissionPolicy } from '../permissions/getPermissionPolicy';
import { newEnforcer } from 'casbin';

/**
 * Determine whether the partner has permission for the endpoint
 * @param partner
 * @param endPoint
 * @param parentLogger
 */
export async function doesRoleHavePermissionToAccessEndpoint(
  partnerKey: PartnerApiKey,
  endPoint: APIEndPoint,
  parentLogger: Logger,
): Promise<boolean> {
  const { functionLogger } = createFunctionLogger(
    'doesRoleHavePermissionToAccessEndpoint',
    parentLogger,
  );

  // Use a CASBIN model, policy and enforcer to test for permissions.
  const model = getPermissionModel();
  const policy = getPermissionPolicy();
  const enforcer = await newEnforcer(model, policy);

  functionLogger.debug(
    `Applying permission check of role ${partnerKey.role} against API Endpoint ${endPoint}`,
  );

  // Check to see whether any of these roles will allow this permission
  const res = await enforcer.enforce(partnerKey.role, endPoint, 'write');
  if (res === true) {
    return true;
  }

  return false;
}
