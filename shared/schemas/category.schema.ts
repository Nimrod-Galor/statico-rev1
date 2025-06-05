import {z} from 'zod'

export const  categorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long")
        .max(64, "Name must be at most 64 characters long"),
    description: z.string()
        .max(256, "Description must be at most 256 characters long")
        .optional(),
    slug: z.string()
        .min(3, "Slug must be at least 3 characters long")
        .max(64, "Slug must be at most 64 characters long")
        .optional(),
    parentId: z.string().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>