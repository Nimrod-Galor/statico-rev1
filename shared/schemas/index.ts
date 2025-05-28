import { userSchema } from './user.schema.ts'
import { userEditSchema } from './user.schema.ts'
import { roleSchema } from './role.schema.ts'
import { productSchema } from './product.schema.ts'
import { postSchema } from './post.schema.ts'
import { commentSchema } from './comment.schema.ts'
import { categorySchema } from './category.schema.ts'


export const schemaRegistry = {
  user: userSchema,
  userEdit: userEditSchema,
  role: roleSchema,
  product: productSchema,
  post: postSchema,
  comment: commentSchema,
  category: categorySchema,
};

export type SchemaType = keyof typeof schemaRegistry;