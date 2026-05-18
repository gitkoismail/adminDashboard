import Card from "../components/Card";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "../components/ui/Loading";
import ErrorState from "../components/ui/ErrorState";
import { FiUsers, FiBriefcase, FiPackage, FiClock, FiPieChart, FiTrendingDown } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Dashboard = () => {
  const COLORS = ["#f59e05", "#22c55e", "#2563eb", "#ef4444"];
  const [timeRange, setTimeRange] = useState("monthly");
  const { data: orders, isLoading, error } = useFetch("/orders");
  const { data: products } = useFetch("/products");
  const { data: staff } = useFetch("/staff");
  const { data: customers } = useFetch("/customers");

  if (isLoading) return <Loading />
  if (error) return <ErrorState
                    title="No Orders Found"
                    message="You don't have any orders yet"
                    link="/orders"
                    linkText="Go Orders"
                  />
  
  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const totalCustomers = customers.length;

  const totalProducts = products.length;

  const pendingOrders = orders.filter(
    (order) => order.orderStatus === "Pending"
  ).length;

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) >= 0 && Number(product.stock) <= 5
  ).length;

  const ordersByTime = Object.values(
  orders.reduce((acc, order) => {
    if (!order.createdAt) return acc;

    const date = new Date(order.createdAt);

    let key;
    let label;

    if (timeRange === "monthly") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      label = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
    } else {
      key = date.toISOString().split("T")[0];
      label = date.toLocaleDateString("en-CA");
    }

    if (!acc[key]) {
      acc[key] = {
        key,
        label,
        date,
        orders: 0
      };
    }

    acc[key].orders += 1;

    return acc;
  }, {})
)
.sort((a, b) => a.date - b.date)
.map(item => ({
  name: item.label,
  orders: item.orders
}));

const orderStatusData = [
  {
    name: "Pending",
    value: orders.filter(o => o.orderStatus === "Pending").length
  },
  {
    name: "Processing",
    value: orders.filter(o => o.orderStatus === "Processing").length
  },
  {
    name: "Delivered",
    value: orders.filter(o => o.orderStatus === "Delivered").length
  },
  {
    name: "Cancelled",
    value: orders.filter(o => o.orderStatus === "Cancelled").length
  }
];

 return (
  <div className='pages dashboard-page'>

    <div className="dashboard-grid">

      {/* CARDS */}
      <div className="col-4">
        <Card title="Total Orders" value={totalOrders} icon= {<FiBriefcase strokeWidth={1}/>} />
      </div>

      <div className="col-4">
        <Card title="Revenue" value={totalRevenue} icon= {<FiPieChart strokeWidth={1}/>}/>
      </div>

      <div className="col-4">
        <Card title="Customers" value={totalCustomers} icon= {<FiUsers strokeWidth={1}/>}/>
      </div>

      <div className="col-4">
        <Card title="Products" value={totalProducts} icon= {<FiPackage strokeWidth={1}/>}/>
      </div>

      <div className="col-4">
        <Card title="Pending Orders" value={pendingOrders} icon= {<FiClock strokeWidth={1}/>}/>
      </div>

      <div className="col-4">
        <Card title="Low Stock" value={lowStockProducts} icon= {<FiTrendingDown strokeWidth={1}/>}/>
      </div>


      {/* BAR CHART */}
      <div className="col-8">
        <div className="chart-box">
          <BarChart width= "100%" height={300} data={ordersByTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#3b82f6" />
          </BarChart>

          <button onClick={() => setTimeRange("daily")}>Daily</button>
          <button onClick={() => setTimeRange("monthly")}>Monthly</button>
        </div>
      </div>


      {/* PIE CHART */}
      <div className="col-4">
        <div className="chart-pie">
          <PieChart width="100%" height={300}>
            <Pie
              data={orderStatusData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={({ name, value, percent }) => {
                if (value === 0) return ""; 

                return `${name} ${value}`; 
              }}
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>


      {/* RECENT ORDERS */}
      <div className="col-8">
        <div className="chart-box">
          <section className="section-userTable">
            <h3>Recent Orders</h3>

            <table className="section-recentTable__container">
              <thead>
                <tr>
                  <th className="section-userTable__header">Customer</th>
                  <th className="section-userTable__header">Product</th>
                  <th className="section-userTable__header">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders
                  .slice(-5)
                  .reverse()
                  .map(order => (
                    <tr key={order.id}>
                      <td className="section-userTable__item">{order.customerName}</td>
                      <td className="section-userTable__item">{order.productName}</td>
                      <td className="section-userTable__item">
                        {order.orderStatus}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>


      {/* LOW STOCK */}
      <div className="col-4">
        <div className="low-stock">
          <h3>Low Stock Alerts</h3>

          <ul className="low-stock-list">
            {products
              .filter(p => p.stock > 0 && p.stock <= 5)
              .slice(0, 5)
              .map(product => (
                <li key={product.id}>
                  {product.productName} — {product.stock} left
                </li>
              ))}
          </ul>

          {products.filter(p => p.stock > 0 && p.stock <= 5).length === 0 && (
            <p>No low stock items 🎉</p>
          )}
        </div>
      </div>

    </div>
  </div>
);
}

export default Dashboard