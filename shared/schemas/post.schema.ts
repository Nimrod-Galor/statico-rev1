import {z} from 'zod'
import validator from 'validator'

import { mongoIdValidation, slugValidation } from './helper.ts'

export const postSchema = z.object({
    id: mongoIdValidation, // MongoDB ID
    slug: slugValidation
        .optional(),
    metatitle: z.string()
        .optional(),
    metadescription: z.string()
        .optional(),
    title: z.string()
        .min(3, "Title must be at least 3 characters long")
        .max(128, "Title must be at most 128 characters long")
        .transform((val) => validator.escape(val))  // Escape the comment input
        .optional(),
    body: z.string()
        .min(1, "Body can not be empty")
        .transform((val) => validator.escape(val)) // Escape the comment input
        .optional(),
    authorId: mongoIdValidation,
    publish: z.boolean()
        .optional(),
    invitedUsers: z.array(mongoIdValidation)
        .optional(),
})

export type PostInput = z.infer<typeof postSchema>
