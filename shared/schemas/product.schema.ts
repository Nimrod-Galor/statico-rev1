import {z} from 'zod'
import validator from 'validator'

import { slugValidation, mongoIdValidation } from './helper.ts'

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
    price: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        return Number(val);
        }, z.number().min(0).refine(val => !isNaN(val), {
        message: "Must be a valid number"
        })),
    stock: z.coerce.number().min(1).refine(val => !isNaN(val), {
        message: "Must be a valid number"
        }),
    category: z.string().or(mongoIdValidation),
    // categoryId: z.string(),
    publish: z.boolean(),
    // viewCount: z.number(),
    authorId: mongoIdValidation,
    // authorId: z.string(),
    files: z.any()
    .refine(
      (files) => !files || files.length <= 10,
      'You can upload up to 10 files only'
    ).optional()
})

export type ProductInput = z.infer<typeof productSchema>