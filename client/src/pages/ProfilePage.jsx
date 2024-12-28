import { useSelector } from "react-redux"

const ProfilePage = () => {

    const user = useSelector(state => state.auth.user);

    return (
        <div>
            <h1>Profile Page</h1>
            <div>
                <img src={user.img}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                />
                <p>@{user.username}</p>
            </div>
        </div>
    );
};

export default ProfilePage;