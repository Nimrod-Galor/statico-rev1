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
        }
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
            comments: true
        }
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
        }
    },
}