import {z} from 'zod'
import validator from 'validator'

import { mongoIdValidation } from './helper.ts'

export const commentSchema = z.object({
    id: mongoIdValidation,  // Optional MongoDB ID
    post: mongoIdValidation,  // Optional MongoDB ID
    parent: mongoIdValidation
        .optional(),  // Optional MongoDB ID
    comment: z.string()
        .min(1, "Comment can not be empty")
        .transform((val) => validator.escape(val)),  // Escape the comment input
    publish: z.boolean(),
    author: z.string(),
    authorId: mongoIdValidation,
    replies: z.number(),
    likes: z.number(),
    dislikes: z.number()
})

export type CommentInput = z.infer<typeof commentSchema>