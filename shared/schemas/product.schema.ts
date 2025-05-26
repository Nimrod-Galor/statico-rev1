import {z} from 'zod'
import validator from 'validator'

import { slugValidation } from './helper'

export const productSchema = z.object({
     metatitle: z.string()
        .optional(),
    metadescription: z.string()
        .optional(),
    slug: slugValidation
        .optional(),
    title: z.string()
        .min(3, "Title must be at least 3 characters long")
        .max(128, "Title must be at most 128 characters long")
        .transform((val) => validator.escape(val)),  // Escape the comment input
    body: z.string()
        .min(1, "Body can not be empty")
        .transform((val) => validator.escape(val)),  // Escape the comment input
    price: z.number(),
    stock: z.number(),
    category: z.string(),
    categoryId: z.string(),
    publish: z.boolean(),
    viewCount: z.number(),
    author: z.string(),
    authorId: z.string(),
    imageUrl: z.string()  
})

export type ProductInput = z.infer<typeof productSchema>