import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from "react-router";
import { deleteItem, getItems } from '../api/index.ts'

import {BiTrash, BiPencil} from 'react-icons/bi';
import toast from 'react-hot-toast';

import {formSchemas} from '../models/formSchemas.ts'

// type ItemsHeaders = {
//     [key: string]: { [key: string]: string }
// }

// const itemsHeaders: ItemsHeaders = {
//     "role": {'name': 'Name', 'description': 'Description', 'default': 'Default'},
//     "user": {'createdAt': 'Date Created', 'email': 'Email', 'userName': 'User Name', 'role': 'Role', 'emailVerified': 'Email Verified', 'comments': 'Comments'},
//     "page": {'metatitle': 'Meta Title', 'metadescription': 'Meta Description', 'slug': 'Slug', 'title': 'Title', 'body': 'Body', 'publish': 'Publish'},
//     "product": {'createdAt': 'Date Created', 'metatitle': 'Meta Title', 'metadescription': 'Meta Description', 'slug': 'Slug', 'title': 'Title', 'body': 'Body', 'price': 'Price', 'stock': 'Stock', 'category': 'Category', 'publish': 'Publish', 'viewCount': 'View Count', 'imageUrl': 'Images', 'comments': 'Comments'},
//     "category": {'name': 'Name', 'description': 'Description', 'slug': 'Slug', 'parentId': 'Parent Id'},
//     "comment": {'createdAt': 'Date Created', 'comment': 'Comment', 'publish': 'Publish', 'product': 'Product', 'productId': 'Product Id', 'author': 'Author', 'parentId': 'Parent Id', 'replies': 'Replies', 'likes': 'Likes', 'dislikes': 'Deslikes'}
// }

function ListItems() {
    const [searchParams] = useSearchParams();
    const { activeCategory= 'role' } = useParams()
    const page = searchParams.get("page") || '1'

    
    // handle Item delte
    const handleDelete = async (id: string) => {
        if(window.confirm(`Delete ${activeCategory}`)){
            await deleteItem(activeCategory, id)
            toast.success(`${activeCategory} Deleted.`)
            query.refetch({ throwOnError: false, cancelRefetch: false })
        }
    }

    // get list data
    const query = useQuery({
        queryKey: ['list-items', {activeCategory, page}],
        queryFn: () => getItems(activeCategory, page)
    })

    if(query.isLoading) {
        return <div className="text-center">Loading...</div>
    }

    if(query.isError) {
        return <div className="text-center">Error: {query.error.message}</div>
    }

    return (
        <div className="bg-white p-4">
            <h1 className="text-center text-2xl font-bold mb-2 capitalize">{activeCategory} content type</h1>
    
            <table className='w-full border-1 border-blue-200'>
                {query.data.data.length === 0 ? <tbody><tr><td colSpan={formSchemas[activeCategory].fields.filter(item => item.displayInList).length + 1} className="p-5 text-center"><div className=''>No items found.</div></td></tr></tbody>
                :
                <>
                <thead className='bg-blue-300'>
                    <tr>
                        {
                        formSchemas[activeCategory].fields.filter(item => item.displayInList).map(({name, label}) => (
                            <th key={name} className='text-left p-3'>{label}</th>
                        ))}
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    query.data.data.map((row: any) => (
                        <tr key={row.id} className=' hover:bg-gray-100 not-odd:bg-gray-200'>
                            {formSchemas[activeCategory].fields.filter(item => item.displayInList).map((item) => (
                                <td key={row[0] + String(item.name)} className="p-3 border-b border-gray-200 ">  
                                    {String(row[item.name])}
                                </td>
                            ))}
                            <td className='p-3 border-b border-gray-200'>
                                <div className='flex justify-end gap-2'>
                                    <button onClick={ () => handleDelete(row.id)}  className='bg-red-600 text-white p-2 rounded cursor-pointer hover:bg-red-700' >
                                        <BiTrash />
                                    </button>
                                    <Link to={`/admin/edit/${activeCategory}/${row.id}`} className='bg-blue-600 text-white p-2 rounded cursor-pointer hover:bg-blue-700'>
                                        <BiPencil />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))
                    }
                </tbody>
                </>
            }

                <tfoot className='bg-blue-300'>
                    <tr>
                        <td colSpan={formSchemas[activeCategory].fields.filter(item => item.displayInList).length + 1} className="p-5 text-right">
                            <Link to={`/admin/create/${activeCategory}`}  className="bg-green-600 text-white p-2 rounded cursor-pointer hover:bg-greeb-700">
                                Create
                            </Link>
                        </td>
                    </tr>
                </tfoot>

            </table>
        </div>
      )
}

export default ListItems