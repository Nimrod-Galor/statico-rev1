import { userSchema } from './user.schema.ts'
import { userUpdateSchema } from './user.schema.ts'
import { roleSchema } from './role.schema.ts'
import { productSchema } from './product.schema.ts'
import { postSchema } from './post.schema.ts'
import { pageSchema } from './page.schema.ts'
import { commentSchema } from './comment.schema.ts'
import { categorySchema } from './category.schema.ts'

export const schemaRegistry = {
  user: userSchema,
  userUpdate: userUpdateSchema,
  role: roleSchema,
  product: productSchema,
  post: postSchema,
  page: pageSchema,
  comment: commentSchema,
  category: categorySchema,
}
export type SchemaRegistry = typeof schemaRegistry;
export type SchemaName = keyof SchemaRegistry;