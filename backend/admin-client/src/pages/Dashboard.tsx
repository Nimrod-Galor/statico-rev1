import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ListItems from "../components/ListItems";

function Dashboard() {
  return (
    <div>
        <Navbar />
        
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <ListItems />
            </div>
        </div>
        
    </div>
  )
}

export default Dashboard