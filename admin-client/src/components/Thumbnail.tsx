import { useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { deleteFile } from '../api'

import type { IFile } from '../types'
import type { ImgHTMLAttributes } from "react"

type ThumbnailProps = ImgHTMLAttributes<HTMLImageElement> & {
    file: IFile
}
function Thumbnail({ file, ...props }: ThumbnailProps) {
    const { contentType = 'role' } = useParams();

    const [imageAlt, setImageAlt] = useState(file.alt || '');

    const handleDelete = () => {
        // Implement delete functionality here
        console.log(`Delete file with id: ${file.id}`)
        if(confirm(`Are you sure you want to delete ${file.filename}?`)) {
            deleteFile(contentType, file.id)
                .then(() => {
                    console.log(`File ${file.filename} deleted successfully`)
                    // Trigger a state update or callback to remove the thumbnail from the UI
                    // window.location.reload(); // Reload the page to reflect changes
                    toast.success(`File ${file.filename} deleted successfully`)
                })
                .catch((error) => {
                    console.error(`Error deleting file: ${error.message}`)
                    toast.error(`Error deleting file: ${error.message}`)
                })
        }
    }
  return (
    <div className='flex flex-col border border-gray-200 rounded-xl p-1 my-2 gap-2'>
        <img src={file.url} alt={file.alt} className='h-auto max-w-full rounded-lg' {...props} />
        <div className='text-sm text-gray-700 dark:text-gray-300'>{file.filename}</div>
        <div className='text-xs text-gray-500 dark:text-gray-400'>{file.uploadedAt}</div>
        <input type="text" name={file.id} value={imageAlt} onChange={(e) => setImageAlt(e.currentTarget.value)} className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
        <button type="button" onClick={()=> handleDelete()} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 hover:cursor-pointer">X</button>
    </div>
  )
}

export default Thumbnail