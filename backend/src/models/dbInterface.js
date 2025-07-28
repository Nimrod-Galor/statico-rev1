export const dbInterface = {
    role: {
        select: {
            id: true,
            name: true,
            description: true,
            default: true
        }
    },
    user: {
        select: {
            id: true,
            createdAt: true,
            email: true,
            userName: true,
            roles: true,
            rolesIDs: true,
            emailVerified: true,
            _count: {
                select: { 
                    // posts: true,
                    comments: true
                }
            },
        },
        destructur: (user) => ({
            ...user,
            posts: user._count.posts,
            comments: user._count.comments,
            roles: user.roles.map(role => role.name),
            _count: undefined // optionally remove the original _count field
        })
    },
    page: {
        select: {
            id: true,
            metatitle: true,
            metadescription: true,
            slug: true,
            title: true,
            body: true,
            publish: true,
            author: true,
            authorId: true,
        },
        destructur: (product) => ({
            ...product,
            author: product.author.userName
        }),
    },
    product: {
        select: {
            id: true,
            createdAt: true,
            metatitle: true,
            metadescription: true,
            slug: true,
            title: true,
            body: true,
            price: true,
            stock: true,
            category: true,
            categoryId: true,
            publish: true,
            viewCount: true,
            author: true,
            authorId: true,
            files: true,
            comments: true,
            _count:{
                select: {
                    comments: true
                }
            }
        },
        destructur: (product) => ({
            ...product,
            author: product.author.userName,
            category: product.category.name,
            comments: product._count.comments,
            _count: undefined
        }),
        constructur: (product) => ({
            ...product,
            category: { connect: { id: product.category } },
            author: { connect: { id: product.authorId } },
            authorId: undefined, // remove authorId if not needed
            // files: product.files ? { connect: product.files.map(file => ({ id: file.id })) } : undefined
        })
    },
    category: {
        select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            parent: true
        },
        destructur: (category) => ({
            ...category,
            parent: category.parent ? category.parent.name : ''
        }),
    },
    comment: {
        select: {
            id: true,
            createdAt: true,
            comment: true,
            publish: true,
            product: true,
            productId: true,
            author: true,
            authorId: true,
            parent: true,
            parentId: true,
            replies: true,
            likes: true,
            dislikes: true,
            _count:{
                select: {
                    replies: true
                }
            }
        },
        destructur: (comment) => ({
            ...comment,
            author: comment.author.userName,
            replies: comment._count.replies,
            post: comment.post.title,
            _count: undefined
        }),
    },
}