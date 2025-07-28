import {z} from 'zod'
import validator from 'validator'

import { mongoIdValidation, slugValidation } from './helper.ts'

const SlateNode = z.object({
  type: z.string(),
  children: z.array(z.object({ text: z.string() })),
});

const SlateContent = z.array(SlateNode).nonempty();

export const pageSchema = z.object({
    id: mongoIdValidation.optional(), // MongoDB ID
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
    body: SlateContent,
    publish: z.boolean()
        .optional(),
    authorId: mongoIdValidation,
})



export type PageInput = z.infer<typeof pageSchema>
