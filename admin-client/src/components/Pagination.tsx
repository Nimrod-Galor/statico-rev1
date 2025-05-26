import { useParams, useSearchParams  } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getTotalPages } from "../api"
import "./pagination.css"

function Pagination() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { activeCategory= 'role' } = useParams()
    const page = searchParams.get("page") || 1

    const query = useQuery({
        queryKey: ['totalPages', {activeCategory}],
        queryFn: () => getTotalPages(activeCategory)
    })

    const pageChange = (pageIndex: number) => {
        setSearchParams((params) => {
            const newParams = new URLSearchParams(params);
            newParams.set('page', String(pageIndex));
            return newParams;
        });
    }

    return (
        <div className="w-full flex justify-center pagination">
            {
                query.data && Array.from({length: Number(query.data.data)}, (_, i) => i + 1).map((pageIndex) => (
                    <button onClick={() => pageChange(pageIndex)} key={pageIndex} className={`btn ${pageIndex == page ? 'btn-active' : ''}`}> 
                        {pageIndex}
                    </button>
                ))
            }
        </div>
    )
}

export default Pagination