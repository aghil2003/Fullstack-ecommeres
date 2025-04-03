import { useEffect, useState } from "react";
import axiosInstance from "../axios/axiosInstance"; 

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users"); 
        setUsers(response.data); 
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="usercontainer w-[80%] m-auto p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-[80%] m-auto bg-white shadow-lg rounded-lg p-4">
          <ul className="space-y-2">
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="p-2 border-b last:border-none">
                  {user.name} - {user.email} 
                </li>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
