import { z } from "zod";
import { mongoIdValidation } from './helper.ts'

export const roleSchema = z.object({
    // id: mongoIdValidation.optional(),
    name: z.enum(['admin', 'author', 'contributor', 'editor', 'subscriber']),
    description: z.string()
        .min(3, "Description must be at least 3 characters long")
        .optional()
})

export type RoleInput = z.infer<typeof roleSchema>