
import Sidebar from "../components/Sidebar";
import ListItems from "../components/ListItems";
import Pagination from "../components/Pagination";

function Dashboard() {
  return (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
            <ListItems />
            <Pagination />
        </div>
    </div>
  )
}

export default Dashboard