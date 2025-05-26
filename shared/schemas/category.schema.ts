import {z} from 'zod'

export const  categorySchema = z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    parentId: z.string()
})

export type CategoryInput = z.infer<typeof categorySchema>