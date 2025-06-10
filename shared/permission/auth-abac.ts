import type { UserEditInput as User } from '../schemas/user.schema.ts'
import type { RoleInput as Role } from '../schemas/role.schema.ts'
import type { ProductInput as Product } from '../schemas/product.schema.ts'
import type { PostInput as Post } from '../schemas/post.schema.ts'
import type { PageInput as Page } from '../schemas/page.schema.ts'
import type { CommentInput as Comment } from '../schemas/comment.schema.ts'
import type { CategoryInput as Category } from '../schemas/category.schema.ts'



type PermissionCheck<Key extends keyof Permissions> =
  | boolean
  | ((user: User, data: Permissions[Key]["dataType"]) => boolean)

type RoleName = Pick<Role, "name">
//"admin" | "author" | "contributor" | "editor" | "subscriber";

type RolesWithPermissions = {
  [R in RoleName["name"] | "guest"]: Partial<{
    [Key in keyof Permissions]: Partial<{
      [Action in Permissions[Key]["action"]]: PermissionCheck<Key>
    }>
  }>
}

type Permissions = {
  // Define the resources and their actions
  admin: {
    dataType: Page
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  },
  user: {
    dataType: User
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  role: {
    dataType: Role
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  product: {
    dataType: Product
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  post: {
    dataType: Post
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  page: {
    dataType: Page
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  comment: {
    dataType: Comment
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  category: {
    dataType: Category
    action: "list" | "view" | "create" | "update" | "delete" | "publish"
  }
  // Add more resources as needed
}

const ROLES = {
  admin: {
    admin: {
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    user: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    role: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    product: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    post: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    page: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },
    comment: {
      list: true,
      view: true,
      create: true,
      update: true,
    },
    category: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      publish: true,
    },    
  },
  author: {
    user: {
      list: false,
      view: true,
      create: false,
      update: (user: User, data: User) => user.id === data.id,
      delete: false,
      publish: false,
    },
    role: {
      list: false,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    product: {
      list: true,
      view: true,
      create: true,
      update: (user: User, product: Product) => product.authorId === user.id,
      delete: (user: User, product: Product) => product.authorId === user.id && !product.publish,
      publish: (user: User, product: Product) => product.authorId === user.id && !product.publish,
    },
    post: {
      list: true,
      view: true,
      create: true,
      update: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)),
      delete: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
      publish: (user: User, post: Post) =>  post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
    },
    page: {
      list: true,
      view: true,
      create: true,
      update: (user: User, page: Page) => page.authorId === user.id,
      delete: (user: User, page: Page) => page.authorId === user.id && !page.publish,
      publish: (user: User, page: Page) => page.authorId === user.id && !page.publish,
    },
    comment: {
      list: true,
      view: true,
      create: true,
      update: (user: User, comment: Comment) => comment.authorId === user.id,
    },
    category: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: false,
      publish: false
    },
  },
  contributor: {
    user: {
      list: false,
      view: true,
      create: false,
      update: (user: User, data: User) => user.id === data.id,
      delete: false,
      publish: false,
    },
    role: {
      list: false,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    product: {
      list: true,
      view: true,
      create: true,
      update: (user: User, product: Product) => product.authorId === user.id,
      delete: (user: User, product: Product) => product.authorId === user.id && !product.publish,
      publish: (user: User, product: Product) => product.authorId === user.id && !product.publish,
    },
    post: {
      list: true,
      view: true,
      create: true,
      update: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)),
      delete: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
      publish: (user: User, post: Post) =>  post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
    },
    page: {
      list: true,
      view: true,
      create: true,
      update: (user: User, page: Page) => page.authorId === user.id,
      delete: (user: User, page: Page) => page.authorId === user.id && !page.publish,
      publish: (user: User, page: Page) => page.authorId === user.id && !page.publish,
    },
    comment: {
      list: true,
      view: true,
      create: true,
      update: (user: User, comment: Comment) => comment.authorId === user.id,
    },
    category: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: false,
      publish: false
    },
  },
  editor:{
    user: {
      list: false,
      view: true,
      create: false,
      update: (user: User, data: User) => user.id === data.id,
      delete: false,
      publish: false,
    },
    role: {
      list: false,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    product: {
      list: true,
      view: true,
      create: true,
      update: (user: User, product: Product) => product.authorId === user.id,
      delete: (user: User, product: Product) => product.authorId === user.id && !product.publish,
      publish: (user: User, product: Product) => product.authorId === user.id && !product.publish,
    },
    post: {
      list: true,
      view: true,
      create: true,
      update: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)),
      delete: (user: User, post: Post) => post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
      publish: (user: User, post: Post) =>  post.authorId === user.id || (Array.isArray(post.invitedUsers) && post.invitedUsers.includes(user.id)) && !post.publish,
    },
    page: {
      list: true,
      view: true,
      create: true,
      update: (user: User, page: Page) => page.authorId === user.id,
      delete: (user: User, page: Page) => page.authorId === user.id && !page.publish,
      publish: (user: User, page: Page) => page.authorId === user.id && !page.publish,
    },
    comment: {
      list: true,
      view: true,
      create: true,
      update: (user: User, comment: Comment) => comment.authorId === user.id,
    },
    category: {
      list: true,
      view: true,
      create: true,
      update: true,
      delete: false,
      publish: false
    },
  },
  subscriber: {
    user: {
      list: false,
      view: (user: User, data: User) => user.id === data.id,
      create: false,
      update: (user: User, data: User) => user.id === data.id,
      delete: false,
      publish: false,
    },
    role: {
      list: false,
      view: false,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    product: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    post: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    page: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    comment: {
      list: true,
      view: true,
      create: true, // Can create comment
      update: (user: User, comment: Comment) => comment.authorId === user.id, // Can only update own comment
    },
    category:{
      list: true,
      view:true, 
      create:false, 
      update:false, 
      delete:false, 
      publish:false
    }
  },
  guest: {
    user: {
      list: false,
      view: false,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    role: {
      list: false,
      view: false,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    product: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    post: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    page: {
      list: true,
      view: true,
      create: false,
      update: false,
      delete: false,
      publish: false,
    },
    comment:{
        list:true, 
        view:true, 
        create:false, 
        update:false, 
        delete:false, 
        publish:false
    },
    category:{
        list:true, 
        view:true, 
        create:false, 
        update:false, 
        delete:false, 
        publish:false
    }
  }
} as const satisfies RolesWithPermissions

export function hasPermission<Resource extends keyof Permissions>(
  user: User,
  resource: Resource,
  action: Permissions[Resource]["action"],
  data?: Permissions[Resource]["dataType"]
) {
  return user.roles.some(role => {
    const permission = (ROLES as RolesWithPermissions)[role as string][resource]?.[action]
    
    if (permission == null){
      return false
    }

    if (typeof permission === "boolean"){
      return permission
    }

    return data != null && permission(user, data)
  })
}


// Example usage:
// Can create a comment
// hasPermission(user, "comment", "create")

// Can view the `todo` Todo
// hasPermission(user, "todos", "view", todo)

// Can view all todos
// hasPermission(user, "todos", "view")
