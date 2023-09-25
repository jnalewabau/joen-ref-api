// spell-checker:ignore nolookalikesSafe
import { customAlphabet } from 'nanoid';
import { nolookalikesSafe } from 'nanoid-dictionary';

/**
 * Use a custom dictionary to get easier to read ids with no special chars
 */
const nanoid = customAlphabet(nolookalikesSafe, 20);

/**
 * @returns An correlationId used for logging
 */
export function nanoIdForCorrelationIds() {
  return `cid_${nanoid()}`;
}

/**
 * @returns An external Id for Foo
 */
export function generateFooExternalId() {
  return `foo_${nanoid()}`;
}
