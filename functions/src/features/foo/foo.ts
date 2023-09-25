import { z } from 'zod';

/**
 * Core schema for Foo
 */
export const FooSchema = z
  .object({
    externalId: z.string().optional(),
    name: z.string(),
    age: z.number(),
    tags: z.array(z.string()).optional(),
  })
  .strict();

// Inferred Foo type
export type Foo = z.infer<typeof FooSchema>;

// Partial Foo type for updates
export const FooDeepPartialSchema = FooSchema.deepPartial();
export type FooDeepPartial = z.infer<typeof FooDeepPartialSchema>;
