import Thumbnail from './Thumbnail.tsx'

import type {IFile} from '../types'

type PrintThumbnailProp = {
    files: IFile[] | undefined
}

function PrintThumbnail({files}: PrintThumbnailProp) {

  return (
    <div>
        {files && files.map((file: IFile) => 
            <div key={file.id}>
              <Thumbnail file={file} />
            </div>
        )
        }
    </div>
  )
}

export default PrintThumbnail