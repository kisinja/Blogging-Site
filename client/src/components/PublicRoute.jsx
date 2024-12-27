import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const user = useSelector(state => state.auth.user);

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PublicRoute;