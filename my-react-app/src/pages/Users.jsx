import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "consumer",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "consumer",
  });

  const loggedInUserRole = localStorage.getItem("useRole");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/users");
      console.log("Fetched users:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user) => {
    setEditingUserId(user.userId);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
    });
    new window.bootstrap.Modal(document.getElementById("editUserModal")).show();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users", formData);
      fetchUsers();
      setFormData({ name: "", email: "", password: "", role: "consumer" });
      window.bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
    } catch (error) {
      console.error("Add failed", error);
      alert("Failed to add user");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    console.log("Editing user ID:", editingUserId); // debug check

    if (!editingUserId) {
      alert("Something went wrong. User ID is missing.");
      return;
    }

    // Exclude password if the role is sales
    const submitData = editFormData.role === "sales"
      ? { ...editFormData, password: undefined }
      : editFormData;

    try {
      await axios.put(`http://localhost:8080/api/users/${editingUserId}`, submitData);
      fetchUsers();
      setEditingUserId(null);
      window.bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update user");
    }
  };

  if (loggedInUserRole === "consumer") {
    return <div className="text-danger p-4">Access Denied</div>;
  }

  const filteredUsers =
    loggedInUserRole === "sales"
      ? users.filter((user) => user.role === "consumer")
      : users;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">User Management</h2>

      {(loggedInUserRole === "admin" || loggedInUserRole === "sales") && (
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={() => {
              setFormData({ name: "", email: "", password: "", role: "consumer" });
              new window.bootstrap.Modal(document.getElementById("addUserModal")).show();
            }}
          >
            Add User
          </button>
        </div>
      )}

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {loggedInUserRole !== "sales" && <th>Password</th>} {/* Only show Password if Admin */}
            <th>Role</th>
            <th>Created</th>
            {loggedInUserRole === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .filter((user) => {
              const lower = searchTerm.toLowerCase();
              return (
                user.name.toLowerCase().includes(lower) ||
                user.email.toLowerCase().includes(lower) ||
                user.role.toLowerCase().includes(lower)
              );
            })
            .map((user) => (
              <tr key={user.userId}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {loggedInUserRole !== "sales" && <td>{user.password}</td>} {/* Only show Password if Admin */}
                <td>{user.role}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                {loggedInUserRole === "admin" && (
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.userId)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleAddSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                name="name"
                className="form-control mb-2"
                placeholder="Name"
                value={formData.name}
                onChange={handleAddChange}
                required
              />
              <input
                name="email"
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={formData.email}
                onChange={handleAddChange}
                required
              />
              {formData.role !== "sales" && (
                <input
                  name="password"
                  type="text"
                  className="form-control mb-2"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleAddChange}
                  required
                />
              )}
              <select
                name="role"
                className="form-control mb-2"
                value={formData.role}
                onChange={handleAddChange}
              >
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Add User</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <form className="modal-content" onSubmit={handleEditSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <input
                name="name"
                className="form-control mb-2"
                placeholder="Name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
              <input
                name="email"
                type="email"
                className="form-control mb-2"
                placeholder="Email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
              {editFormData.role !== "sales" && (
                <input
                  name="password"
                  type="text"
                  className="form-control mb-2"
                  placeholder="Password"
                  value={editFormData.password}
                  onChange={handleEditChange}
                  required
                />
              )}
              <select
                name="role"
                className="form-control mb-2"
                value={editFormData.role}
                onChange={handleEditChange}
              >
                <option value="admin">Admin</option>
                <option value="sales">Sales</option>
                <option value="consumer">Consumer</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Update</button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Users;
