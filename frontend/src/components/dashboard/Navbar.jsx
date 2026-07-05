
import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center h-12 bg-red-600 px-5">
      <p>
        Welcome {user?.name}
      </p>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded text-white">Logout
      </button>
    </div>
  );
};

export default Navbar;