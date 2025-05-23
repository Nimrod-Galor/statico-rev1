import { z } from "zod";

export const schemas = { 
    role : z.object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      description: z.string().min(2, "Decription must be at least 2 characters"),
      default: z.boolean()
    }),
    
    user: z.object({
      createdAt: z.date(),
      email: z.string().email("Must be a valid email"),
      userName: z.string().min(4, "User name must be at least 4 characters"),
      role: z.string(),
      roleId: z.string(),
      emailVerified: z.boolean(),
      comments: z.string().readonly()
    }),

    page: z.object({
      metatitle: z.string().min(6, "Metatitle must be at least 6 characters"),
      metadescription: z.string().min(10, "metadescription must be at least 10 characters"),
      slug: z.string().min(4, "Slug must be at least 4 characters"),
      title: z.string().min(3, "Title must be at least 3 characters"),
      body: z.string().min(10, "Body must be at least 10 characters"),
      publish: z.boolean()
    }),

    product: z.object({
      createdAt: z.date(),
      metatitle: z.string(),
      metadescription: z.string(),
      slug: z.string(),
      title: z.string(),
      body: z.string(),
      price: z.number(),
      stock: z.number(),
      category: z.string(),
      categoryId: z.string(),
      publish: z.boolean(),
      viewCount: z.number(),
      author: z.string(),
      authorId: z.string(),
      imageUrl: z.string(),
      comments: z.string(),
    }),

    category: z.object({
      name: z.string(),
      description: z.string(),
      slug: z.string(),
      parentId: z.string()
    }),

    comment: z.object({
      createdAt: z.date(),
      comment: z.string(),
      publish: z.boolean(),
      product: z.string(),
      productId: z.string(),
      author: z.string(),
      authorId: z.string(),
      parent: z.string(),
      parentId: z.string(),
      replies: z.number(),
      likes: z.number(),
      dislikes: z.number()
    })
}



// email: z.string().email("Must be a valid email"),

// z.string().regex(/^\d+$/, "Must be a valid number"),