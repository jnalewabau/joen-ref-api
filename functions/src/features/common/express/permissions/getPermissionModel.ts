import { newModelFromString } from 'casbin';

/**
 * Returns an casbin RBAC model.
 *
 * Use https://casbin.org/editor/ to be able to test this against the specific policy getPermissionPolicy
 */
export function getPermissionModel() {
  const model = newModelFromString(`[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
`);

  return model;
}
