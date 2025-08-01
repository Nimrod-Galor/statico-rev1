// import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router";
// import { getContentType } from '../api/index.ts'

import {formSchemas} from '../models/formSchemas.ts'
import { Link } from 'react-router-dom';

function Sidebar() {
  let { activeCategory } = useParams()
  
  // const query = useQuery({
  //   queryKey: ['sidebar-categories'],
  //   queryFn: () => getContentType(),
  // })

  // if(query.isLoading) {
  //   return <div className="w-sm min-h-fit bg-gray-200 p-4">Loading...</div>
  // }
  // if(query.isError) {
  //   return <div className="w-sm min-h-full bg-gray-200 p-4">Error: {query.error.message}</div>
  // }

  if( activeCategory === undefined) {
    // If no active category is set in query params, set it to the first one from category list
    activeCategory = Object.keys(formSchemas)[0]
  }

  return (
    <div className="w-sm min-h-full overflow-auto p-0 bg-gray-200">
      <ul className="space-y-2">
        {Object.keys(formSchemas).map((category: string) => (
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