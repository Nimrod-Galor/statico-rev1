import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router";
import { getCategories } from '../api/index.ts'
import { Link } from 'react-router-dom';

function Sidebar() {
  let { activeCategory } = useParams()
  
  const query = useQuery({
    queryKey: ['sidebar-categories'],
    queryFn: () => getCategories(),
  })

  if(query.isLoading) {
    return <div className="w-sm h-screen bg-gray-200 p-4">Loading...</div>
  }
  if(query.isError) {
    return <div className="w-sm h-screen bg-gray-200 p-4">Error: {query.error.message}</div>
  }

  if( activeCategory === undefined) {
    // If no active category is set in query params, set it to the first one from category list
    activeCategory = query.data.data[0]
  }

  return (
    <div className="w-sm h-[calc(100vh-50px)] overflow-auto p-0 bg-gray-200 shadow-md rounded-md">
      <ul className="space-y-2">
        {query.data.data.map((category: string, index: number) => (
          <Link to={`/admin/${category}`} key={category} className="text-blue-600 hover:underline">
            <li className="width-full px-5 py-2 my-0 hover:bg-gray-50 cursor-pointer" style={{backgroundColor: activeCategory === category ?  'white' : ''}} >
                {category}
            </li>
          </Link>
        ))}
        
        <Link to="/admin/settings" className="text-blue-600 hover:underline" key='settings'>
          <li className={`width-full px-5 py-2 my-0 ${activeCategory === 'settings' ? 'bg-white' : ''} hover:bg-gray-50 cursor-pointer`} >
            Settings
          </li>
        </Link>
      </ul>
    </div>
  )
}

export default Sidebar