import CustomersTable from "../components/CustomersTable";
import AddCustomer from "../components/AddCustomer";
import useCrudPage from "../hooks/useCrudPage";
import useFetch from "../hooks/useFetch";
import useOrderActions from "../hooks/useOrderActions";
import api from "../services/api";
import dummyCustomers from "../data/dummyCustomers";

const customerConfig = {
  endpoint: "/customers",
  fallbackData: dummyCustomers,
  initialForm: {
    fullName: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    status: "",
  },
  searchFields: ["fullName", "email", "phone"],
  filterField: "status",
  filters: {
    vip: "VIP",
    active: "Active",
    leads: "Leads",
    churnRisk: "Churn Risk",
    inactive: "Inactive",
  },
};

const Customers = ( ) => {
  const { isLoading, error} = useFetch("/customers");
  const {
    items: customers,
    formData: newCustomers,
    editingId,
    filter,
    setFilter,
    search,
    setSearch,
    filteredItems: filteredCustomers,
    stats,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEditStart,
  } = useCrudPage(customerConfig);

  const { data: orders } = useFetch("/orders");
  const { data: products } = useFetch("/products");
  const { handleDeleteWithStock } = useOrderActions(
    orders,
    products,
    async (id) => {
      await api.delete(`/orders/${id}`); 
    }
  );

const handleDeleteCustomerWithCascade = async (customerId) => {
  const confirmDelete = window.confirm(
    "This customer has related orders. Delete everything?"
  );

  if (!confirmDelete) return; 
  try {
    const res = await api.get("/orders");
    const allOrders = res.data;

    const relatedOrders = allOrders.filter(
      (order) => String(order.customerId) === String(customerId)
    );

    await Promise.all(
      relatedOrders.map(order => handleDeleteWithStock(order.id))
    );

    await handleDelete(customerId);

  } catch (err) {
    console.log(err.message);
  }
};
  

  return (
    <main className="pages customers-page">
      <h2>Customer Management</h2>

      <nav className="pagesUsers__nav">
        <form className="pagesUsers__form" onSubmit={(e) => e.preventDefault()}>
          <label className="offscreen" htmlFor="search">Customer Search</label>
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
          <button className={filter === "vip" ? "is-active" : ""} onClick={() => setFilter("vip")}>VIP</button>
          <button className={filter === "active" ? "is-active" : ""} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "leads" ? "is-active" : ""} onClick={() => setFilter("leads")}>Leads</button>
          <button className={filter === "churnRisk" ? "is-active" : ""} onClick={() => setFilter("churnRisk")}>Churn Risk</button>
          <button className={filter === "inactive" ? "is-active" : ""} onClick={() => setFilter("inactive")}>Inactive</button>
        </div>
      </nav>

      
      <section className="pagesUsers__section-p">
        <p>Total: {stats.all}</p>
        <p>VIP: {stats.vip}</p>
        <p>Active: {stats.active}</p>
        <p>Leads: {stats.leads}</p>
        <p>Churn Risk: {stats.churnRisk}</p>
        <p>Inactive: {stats.inactive}</p>
      </section>

      {!isLoading && !error && !customers.length && (
        <div className="empty-message">
          <p>No customers yet. Start by adding your first customer.</p>
        </div>
      )}

      <CustomersTable
        filteredCustomers={filteredCustomers}
        handleDelete={handleDeleteCustomerWithCascade}
        handleUser={handleEditStart}
        customers={customers}
      />

      <AddCustomer
        newCustomers={newCustomers}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEdit={handleSubmit}
        editingId={editingId}
      />
    </main>
  );
};

export default Customers;