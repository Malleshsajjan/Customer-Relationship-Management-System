import React, { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userRole = localStorage.getItem("useRole"); // 👈 Get role from storage

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (customer) => {
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setEditingCustomerId(customer.customerId);

    const modal = new window.bootstrap.Modal(document.getElementById("editModal"));
    modal.show();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/customers/${editingCustomerId}`, formData);
      alert("Customer updated successfully!");
      fetchCustomers();
      setFormData({ name: "", email: "", phone: "", address: "" });
      setEditingCustomerId(null);
      window.bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Failed to update customer.");
    }
  };

  // 🔒 Access Control: Block consumer
  if (userRole === "consumer") {
    return <div className="text-danger p-4">Access Denied</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Customer Management</h2>

      <input
        type="text"
        placeholder="Search customers..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Address</th>
            {userRole === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {customers
            .filter((cust) => {
              const lowerSearch = searchTerm.toLowerCase();
              return (
                cust.name.toLowerCase().includes(lowerSearch) ||
                cust.email.toLowerCase().includes(lowerSearch) ||
                cust.phone.includes(lowerSearch) ||
                cust.address.toLowerCase().includes(lowerSearch)
              );
            })
            .map((cust) => (
              <tr key={cust.customerId}>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone}</td>
                <td>{cust.address}</td>
                {userRole === "admin" && (
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(cust)}>
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal only shown if user is admin */}
      {userRole === "admin" && (
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-labelledby="editModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title" id="editModalLabel">Edit Customer</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="form-control mb-2" />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="form-control mb-2" />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required className="form-control mb-2" />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="form-control mb-2" />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-success">Save Changes</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
