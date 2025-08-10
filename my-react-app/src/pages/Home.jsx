import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    activeDeals: 42, // These are still hardcoded
    monthlyRevenue: 12500,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, customersRes] = await Promise.all([
          axios.get("http://localhost:8080/api/total-users"),
          axios.get("http://localhost:8080/api/total-customers"),
        ]);

        setStats(prev => ({
          ...prev,
          totalUsers: usersRes.data.totalUsers,
          totalCustomers: customersRes.data.totalCustomers,
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">CRM Overview</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary shadow">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-6">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Customers</h5>
              <p className="card-text display-6">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Active Deals</h5>
              <p className="card-text display-6">46</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger shadow">
            <div className="card-body">
              <h5 className="card-title">Monthly Revenue</h5>
              <p className="card-text display-6">$56,000</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4 shadow">
        <div className="card-header bg-secondary text-white">Recent Activities</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">📝 New customer "John Doe" added by Sales Team.</li>
          <li className="list-group-item">📩 Email sent to "susan@example.com".</li>
          <li className="list-group-item">✅ Deal "Product Package A" closed by Sarah.</li>
          <li className="list-group-item">🔔 Reminder: Follow up with "TechCorp Inc."</li>
        </ul>
      </div>

      <div className="card shadow">
        <div className="card-header bg-info text-white">Upcoming Tasks</div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">📆 Meeting with client “Omega Ltd” – April 15, 3:00 PM</li>
          <li className="list-group-item">📞 Follow-up call to “Megan Smith” – April 16</li>
          <li className="list-group-item">🛠 Prepare Q2 Sales Report – Due April 20</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
