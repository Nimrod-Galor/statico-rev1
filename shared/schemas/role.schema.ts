import { z } from "zod";
import { mongoIdValidation } from './helper.ts'

export const roleSchema = z.object({
    id: mongoIdValidation,
    name: z.string()
        .min(3, "Role must be at least 3 characters long")
        .optional(),
    description: z.string()
        .min(3, "Description must be at least 3 characters long")
        .optional()
})

export type RoleInput = z.infer<typeof roleSchema>