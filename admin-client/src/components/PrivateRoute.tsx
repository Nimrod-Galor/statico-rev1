import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function PrivateRoute() {
    const { authToken } = useAuth();

    if(!authToken){
        return <Navigate to="/admin/login" />
    }

    return (
        <Outlet />
    )
}

export default PrivateRoute