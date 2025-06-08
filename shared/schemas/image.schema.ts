import { z } from 'zod';

export const imageSchema = z.object({
  images: z.array(
    z.object({
        file: z.any().refine((f) => f instanceof File || f?.name, 'Image file is required'),
    //   alt: z.string().min(1, 'Alt text is required'),
    //   previewUrl: z.string().url().optional(),
        id: z.string().optional(),
        filename: z.string().optional(),
        url: z.string().optional(),
        alt: z.string().optional(),
        productId: z.string().optional(),
        uploadedAt: z.string().optional(),
    })
  ),
});

export type ImageFormData = z.infer<typeof imageSchema>;