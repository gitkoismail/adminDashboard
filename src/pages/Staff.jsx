import StaffTable from "../components/StaffTable";
import AddStaff from "../components/AddStaff";
import useCrudPage from "../hooks/useCrudPage";
import useFetch from "../hooks/useFetch";
import dummyStaff from "../data/dummyStaff"; 

const staffConfig = {
  endpoint: "/staff",
  fallbackData: dummyStaff,
  initialForm: {
    department: "",
    name: "",
    email: "",
    password: "",
    role: "",
    status: "",
  },
  searchFields: ["name", "department", "role"],
  filterField: "status",
  filters: {
    active: "Active",
    pending: "Pending",
    inactive: "Inactive",
    online: "Online",
    offline: "Offline",
  },
  beforeSubmit: (formData, { editingId }) => {
    return {
      ...formData,
      status: "Offline",
      password: editingId ? formData.password : "1234"
    };
  }
};

const Staff = () => {
  const {
    items: staff,
    formData: newStaff,
    isLoading,
    error,
    editingId,
    filter,
    setFilter,
    search,
    setSearch,
    filteredItems: filteredStaff,
    stats,
    handleChange,
    handleSubmit,
    handleDelete,
    handleEditStart,
  } = useCrudPage(staffConfig);

  return (
    <main className="pages staff-page">
      <h2>Staff Management</h2>

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
          <button className={filter === "online" ? "is-active" : ""} onClick={() => setFilter("online")}>Online</button>
          <button className={filter === "active" ? "is-active" : ""} onClick={() => setFilter("active")}>Active</button>
          <button className={filter === "pending" ? "is-active" : ""} onClick={() => setFilter("pending")}>Pending</button>
          <button className={filter === "inactive" ? "is-active" : ""} onClick={() => setFilter("inactive")}>Inactive</button>
          <button className={filter === "offline" ? "is-active" : ""} onClick={() => setFilter("offline")}>Offline</button>
        </div>
      </nav>

      <section className="pagesUsers__section-p">
        <p>Total: {stats.all}</p>
        <p>Online: {stats.online}</p>
        <p>Active: {stats.active}</p>
        <p>Pending: {stats.pending}</p>
        <p>Inactive: {stats.inactive}</p>
        <p>Offline: {stats.offline}</p>
      </section>

      {!isLoading && !error && !staff.length && (
        <div className="empty-message">
          <p>No staff yet. Start by adding your first staff.</p>
        </div>
      )}

      <StaffTable
        filteredStaff={filteredStaff}
        handleDelete={handleDelete}
        handleUser={handleEditStart}
        staff={staff}
      />

      <AddStaff
        newStaff={newStaff}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEdit={handleSubmit}
        editingId={editingId}
      />
    </main>
  );
};

export default Staff;