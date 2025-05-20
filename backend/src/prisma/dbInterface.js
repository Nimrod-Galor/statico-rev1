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
            role: true,
            roleId: true,
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
            role: user.role.name,
            roleId: user.role.id,
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
            publish: true
        }
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
            imageUrl: true,
            comments: true,
            _count:{
                select: {
                    comments: true
                }
            }
        },
        destructur: (post) => ({
            ...product,
            author: post.author.userName,
            comments: post._count.comments,
            _count: undefined
        }),
    },
    category: {
        select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            parentId: true
        }
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