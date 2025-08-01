export type FieldType = 'text' | 'number' | 'textarea' | 'wysiwyg' | 'check' | 'url' | 'password' | 'select' | 'file' | 'hidden' | 'none'

export type FormField = {
    name: string;
    type: FieldType;
    label: string;
    options?: { id: string; name: string }[]; // For static select
    fetchFrom?: string; // content type for select options data
    multi?: boolean; // for select, if multiple options can be selected
    displayInList: boolean; // display item in List items page
    displayInForm: boolean; // display item in create/edit form page
    fileFilter?: string; // file filter for file input
}

export type FormSchema = {
  fields: FormField[];
}

export const formSchemas: Record<string, FormSchema> = {
    role: {
        fields: [
            {name: 'name', type: 'text', label: 'Name', displayInList: true, displayInForm: true},
            {name: 'description', type: 'text', label: 'Description', displayInList: true, displayInForm: true},
            {name: 'default', type: 'check', label: 'Default', displayInList: true, displayInForm: true}
        ]
    },
    user: {
        fields: [
            {name: 'createdAt', type: 'text', label: 'Date Created', displayInList: true, displayInForm: false},
            {name: 'email', type: 'text', label: 'Email', displayInList: true, displayInForm: true},
            {name: 'userName', type: 'text', label: 'User Name', displayInList: true, displayInForm: true},
            {name: 'password', type: 'password', label: 'Password', displayInList: false, displayInForm: true},
            {name: 'rePassword', type: 'password', label: 'Re Password', displayInList: false, displayInForm: true},
            {name: 'roles', type: 'select', multi: true, label: 'Role', fetchFrom: 'role', displayInList: true, displayInForm: true},
            {name: 'emailVerified', type: 'check', label: 'Email Verified', displayInList: true, displayInForm: false},
            {name: 'comments', type: 'text', label: 'Comments', displayInList: true, displayInForm: false}
        ]
    },
    page: {
        fields: [
            {name: 'metatitle', type: 'text', label: 'Meta Title', displayInList: true, displayInForm: true},
            {name: 'metadescription', type: 'text', label: 'Meta Description', displayInList: true, displayInForm: true},
            {name: 'slug', type: 'text', label: 'Slug', displayInList: true, displayInForm: true},
            {name: 'title', type: 'text', label: 'Title', displayInList: true, displayInForm: true},
            {name: 'body', type: 'wysiwyg', label: 'Body', displayInList: false, displayInForm: true},
            {name: 'publish', type: 'check', label: 'Publish', displayInList: true, displayInForm: true},
            {name: 'authorId', type: 'hidden', label: 'Author', displayInList: false, displayInForm: true},
            {name: 'author', type: 'none', label: 'Author', displayInList: true, displayInForm: false},
        ]
    },
    product: {
        fields: [
            {name: 'createdAt', type: 'text', label:  'Date Created', displayInList: true, displayInForm: false},
            {name: 'metatitle', type: 'text', label: 'Meta Title', displayInList: true, displayInForm: true},
            {name: 'metadescription', type: 'text', label: 'Meta Description', displayInList: true, displayInForm: true},
            {name: 'slug', type: 'text', label: 'Slug', displayInList: true, displayInForm: true},
            {name: 'title', type: 'text', label: 'Title', displayInList: true, displayInForm: true},
            {name: 'body', type: 'textarea', label: 'Body', displayInList: true, displayInForm: true},
            {name: 'price', type: 'number', label: 'Price', displayInList: true, displayInForm: true},
            {name: 'stock', type: 'number', label: 'Stock', displayInList: true, displayInForm: true},
            {name: 'category', type: 'select', label: 'Category', displayInList: true, displayInForm: true, fetchFrom: 'category'},
            {name: 'publish', type: 'check', label: 'Publish', displayInList: true, displayInForm: true},
            {name: 'viewCount', type: 'text', label: 'View Count', displayInList: true, displayInForm: false},
            {name: 'files', type: 'file', label: 'Images', displayInList: false, displayInForm: true, fileFilter: 'image/*'},
            {name: 'comments', type: 'text', label: 'Comments', displayInList: true, displayInForm: false},
            {name: 'author', type: 'text', label: 'Author', displayInList: true, displayInForm: false},
            {name: 'authorId', type: 'hidden', label: 'Author', displayInList: false, displayInForm: true}
        ]
    },
    category: {
        fields: [
            {name: 'name', type: 'text', label: 'Name', displayInList: true, displayInForm: true},
            {name: 'description', type: 'text', label: 'Description', displayInList: true, displayInForm: true},
            {name: 'slug', type: 'text', label: 'Slug', displayInList: true, displayInForm: true},
            {name: 'parent', type: 'select', label: 'Parent Categoy', displayInList: true, displayInForm: true, fetchFrom: 'category', options: [{id: '', name: 'None'}]}
        ]
    },
    comment: {
        fields: [
            {name: 'createdAt', type: 'text', label: 'Date Created', displayInList: true, displayInForm: true},
            {name: 'comment', type: 'text', label: 'Comment', displayInList: true, displayInForm: true},
            {name: 'publish', type: 'text', label: 'Publish', displayInList: true, displayInForm: true},
            {name: 'product', type: 'text', label: 'Product', displayInList: true, displayInForm: true},
            {name: 'productId', type: 'text', label: 'Product Id', displayInList: true, displayInForm: true},
            {name: 'author', type: 'text', label: 'Author', displayInList: true, displayInForm: true},
            {name: 'parentId', type: 'text', label: 'Parent Id', displayInList: true, displayInForm: true},
            {name: 'replies', type: 'text', label: 'Replies', displayInList: true, displayInForm: true},
            {name: 'likes', type: 'text', label: 'Likes', displayInList: true, displayInForm: true},
            {name: 'dislikes', type: 'text', label: 'Deslikes', displayInList: true, displayInForm: true}
        ]
    }
};