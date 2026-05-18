import OrdersTable from "../components/OrdersTable";
import AddOrders from "../components/AddOrders.jsx";
import useCrudPage from "../hooks/useCrudPage.js";
import useFetch from "../hooks/useFetch.js";
import useOrderActions from "../hooks/useOrderActions.js";
import api from "../services/api.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/ui/Loading.jsx";
import dummyOrders from "../data/dummyOrders";

const Orders = ( {setOrderDelete} ) => {
  const { isLoading, error} = useFetch("/orders");
  const { data: customers } = useFetch("/customers");
  const { data: products } = useFetch("/products");

  const orderConfig = useMemo(
    () => ({
      endpoint: "/orders",
      fallbackData: dummyOrders,
      initialForm: {
        customerId: "",
        customerName: "",
        productId: "",
        productName: "",
        quantity: "",
        totalAmount: "",
        paymentStatus: "",
        orderStatus: "",
      },
      searchFields: ["customerName", "productName", "quantity"],
      filterField: "orderStatus",
      filters: {
        pending: "Pending",
        processing: "Processing",
        delivered: "Delivered",
        cancelled: "Cancelled",
      },
      
      beforeSubmit: async (formData, { editingId, items, originalItem }) => {
        const selectedCustomer = customers.find(
          (customer) => String(customer.id) === String(formData.customerId)
        );

        const selectedProduct = products.find(
          (product) => String(product.id) === String(formData.productId)
        );

        if (!selectedCustomer || !selectedProduct) {
          alert("Material not found!");
          return null;
        }

        const quantity = Number(formData.quantity);
        const stock = Number(selectedProduct.stock);
        const price = Number(selectedProduct.price);

        // ❗ Quantity kontrolü
        if (!Number.isFinite(quantity) || quantity <= 0) {
          alert("Quantity must be greater than 0");
          return null;
        }

        const stockAffectingStatuses = ["Processing", "Delivered"];

        const getStockEffect = (order) => {
          if (!order) return 0;

          const orderQuantity = Number(order.quantity);
          const orderStatus = order.orderStatus;

          return stockAffectingStatuses.includes(orderStatus)
            ? orderQuantity
            : 0;
        };

        const newOrder = {
          ...formData,
          quantity,
        };

        const newEffect = getStockEffect(newOrder);

        if (newEffect > stock && !editingId) {
          alert(`Only ${stock} items left in stock`);
          return null;
        }

        if (
          selectedProduct.status === "Out of Stock" &&
          newEffect > 0
        ) {
          alert("This product is marked as out of stock!");
          return null;
        }

        // CREATE DURUMU
        if (!editingId) {
          if (newEffect > 0) {
            await api.patch(`/products/${selectedProduct.id}`, {
              stock: stock - newEffect,
            });
          }
        }

        // EDIT DURUMU
        if (editingId) {
          const oldEffect = getStockEffect(originalItem);
          const newStock = stock + oldEffect - newEffect;

          if (newStock < 0) {
            alert(`Only ${stock + oldEffect} items available for this update`);
            return null;
          }

          await api.patch(`/products/${selectedProduct.id}`, {
            stock: newStock,
          });
        }

        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );

        return {
          ...formData,
          customerName: selectedCustomer.fullName,
          productName: selectedProduct.productName,
          quantity,
          totalAmount: quantity * price,
          createdBy: currentUser.id,
          createdAt: editingId && originalItem?.createdAt
            ? originalItem.createdAt
            : new Date().toISOString(),
        };
      },
    }),
    [customers, products]
  );

  const {
    items: orders,
    formData: newOrders,
    editingId,
    filter,
    setFilter,
    search,
    setSearch,
    filteredItems: filteredOrders,
    stats,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEditStart,
  } = useCrudPage(orderConfig);

  if (isLoading) return <Loading />;

const { handleDeleteWithStock } = useOrderActions(
  orders,
  products,
  handleDelete 
);

  return (
    <main className="pages orders-page">
          <h2>Order Management</h2>
          <nav className="pagesUsers__nav">
            <form className="pagesUsers__form" onSubmit={(e) => e.preventDefault()}>
              <label className="offscreen" htmlFor="search">
                Order Search
              </label>
              <input
                placeholder="Search"
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            <div className="pagesUsers__section-button">
              <button className={filter === "all" ? "is-active" : ""} onClick={() => setFilter("all")}>All</button>
              <button className={filter === "delivered" ? "is-active" : ""} onClick={() => setFilter("delivered")}>Delivered</button>
              <button className={filter === "processing" ? "is-active" : ""} onClick={() => setFilter("processing")}>Processing</button>
              <button className={filter === "pending" ? "is-active" : ""} onClick={() => setFilter("pending")}>Pending</button>
              <button className={filter === "cancelled" ? "is-active" : ""} onClick={() => setFilter("cancelled")}>Cancelled</button>
            </div>
          </nav>

          <section className="pagesUsers__section-p">
            <p>All: {stats.all}</p>
            <p>Delivered: {stats.delivered}</p>
            <p>Processing: {stats.processing}</p>
            <p>Pending: {stats.pending}</p>
            <p>Cancelled: {stats.cancelled}</p>
          </section>


           {!isLoading && !orders.length && (
              <div className="empty-message">
                <p>No orders yet. Start by adding your first order.</p>
              </div>
            )}

          <OrdersTable
            filteredOrders={filteredOrders}
            handleDelete={handleDeleteWithStock}
            handleUser={handleEditStart}
            orders={orders}
          />

          <AddOrders
            newOrders={newOrders}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            products={products}
            customers={customers}
        />

    </main>
  );
};

export default Orders;