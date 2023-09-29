import { z } from 'zod';
const KeyRolesSchema = z.enum(['fully_trusted_partner', 'read_only', 'crud_foo']);
export type KeyRoles = z.infer<typeof KeyRolesSchema>;

/**
 * Core schema for PartnerApiKeys
 */
const PartnerApiKeySchema = z
  .object({
    apiKey: z.string(),
    role: KeyRolesSchema,
    disabled: z.boolean(),
  })
  .strict();

export type PartnerApiKey = z.infer<typeof PartnerApiKeySchema>;
/**
 * Core schema for PartnerInfo
 */
const PartnerInfoSchema = z
  .object({
    externalId: z.string(),
    name: z.string(),
    apiKeys: z.array(PartnerApiKeySchema),
  })
  .strict();

// Inferred Foo type
export type PartnerInfo = z.infer<typeof PartnerInfoSchema>;
