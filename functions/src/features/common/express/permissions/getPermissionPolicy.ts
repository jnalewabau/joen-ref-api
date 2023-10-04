import { StringAdapter } from 'casbin';

/**
 * Returns an casbin RBAC policy for endpoints
 *
 * Use https://casbin.org/editor/ to be able to test this against the standard RBAC model
 *
 */
export function getPermissionPolicy() {
  const policy = new StringAdapter(`
  p, fully_trusted_partner, ListFoos, write
  p, fully_trusted_partner, CreateFoo, write
  p, fully_trusted_partner, ReadFoo, write
  p, fully_trusted_partner, UpdateFoo, write
  p, fully_trusted_partner, DeleteFoo, write

  p, read_only, ListFoos, write
  p, read_only, ReadFoo, write

  p, crud_foo, ListFoos, write
  p, crud_foo, CreateFoo, write
  p, crud_foo, ReadFoo, write
  p, crud_foo, UpdateFoo, write
  p, crud_foo, DeleteFoo, write
  `);

  return policy;
}
