import { useQuery } from '@tanstack/react-query'
import { Link, useParams, useSearchParams } from "react-router";
import { deleteItem, getItems } from '../api/index.ts'

import {BiTrash, BiPencil} from 'react-icons/bi';
import toast from 'react-hot-toast';

function ListItems() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { activeCategory= 'role' } = useParams()

    const page = searchParams.get("page") || '1'

    const handleDelete = async (id: string) => {
        if(window.confirm(`Delete ${activeCategory}`)){
            await deleteItem(activeCategory, id)
            toast.success(`${activeCategory} Deleted.`)
            query.refetch({ throwOnError: false, cancelRefetch: false })
        }
    }

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

    if(query.data.data.length === 0){
        return <div className='text-center'>No items found.</div>
    }

    return (
        <div>
                <div className="bg-white p-4">
                    <table className='w-full border-2 border-gray-200'>
                        <caption>
            <h1 className="text-center text-2xl font-bold mb-2">{activeCategory} content type</h1>

                        </caption>
                        <thead className='bg-blue-200'>
                            <tr>
                                {Object.keys(query.data.data[0]).slice(1).map((header: any, index: number) => (
                                    <th key={header} className='text-left p-3'>{header}</th>
                                ))}
                                <th>
                                    &nbsp;
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                                {
                                    query.data.data.map((row: any, index: number) => (
                                        <tr key={row.id} className=' hover:bg-gray-100 not-odd:bg-gray-200'>
                                            {Object.entries(row).slice(1).map(([key, value]) => (
                                                <td key={row.id + String(key)} className="p-3 border-b border-gray-200 ">  
                                                    {String(value)}
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
                        <tfoot>
                            <tr>
                                <td colSpan={query.data.data.length + 2} className="p-5 text-right">
                                    <Link to={`/admin/create/${activeCategory}`}  className="bg-green-600 text-white p-2 rounded cursor-pointer hover:bg-greeb-700">
                                        Create
                                    </Link>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            
        </div>
      )
}

export default ListItems