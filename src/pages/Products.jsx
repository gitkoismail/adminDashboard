import ProductsTable from "../components/ProductsTable";
import AddProducts from "../components/AddProducts.jsx";
import useCrudPage from "../hooks/useCrudPage.js";
import useFetch from "../hooks/useFetch.js";
import useOrderActions from "../hooks/useOrderActions.js";
import api from "../services/api.js";
import dummyProducts from "../data/dummyProducts";

const productConfig = {
  endpoint: "/products",
  fallbackData: dummyProducts,
  initialForm: {
    productName: "",
    category: "",
    price: "",
    stock: "",
    sku: "",
    status: "",
  },
  searchFields: ["productName", "category", "price"],
  filterField: "status",
  filters: {
    inStock: "In Stock",
    lowStock: "Low Stock",
    out_of_stock: "Out of Stock",
  },
};

const Products = ( ) => {
  const { isLoading, error } = useFetch("/products");
  
 const {
      items: products,
      formData: newProducts,
      editingId,
      filter,
      setFilter,
      search,
      setSearch,
      filteredItems: filteredProducts,
      stats,
      handleChange,
      handleSubmit,
      handleDelete,
      handleEditStart,
    } = useCrudPage(productConfig);

    const { data: orders } = useFetch("/orders");
  const { handleDeleteWithStock } = useOrderActions(
    orders,
    products,
    async (id) => {
      await api.delete(`/orders/${id}`); 
    }
  );

   const handleDeleteProductWithCascade = async (productId) => {
    const confirmDelete = window.confirm(
      "This product has related orders. Delete everything?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.get("/orders");
      const allOrders = res.data;

      const relatedOrders = allOrders.filter(
        (order) => String(order.productId) === String(productId)
      );

      await Promise.all(
        relatedOrders.map(order => handleDeleteWithStock(order.id))
      );

      await handleDelete(productId);

    } catch (err) {
      console.log(err.message);
    }
  };
  

  return (
    <main className="pages products-page">
      <h2>Product Management</h2>

      <nav className="pagesUsers__nav">
        <form className="pagesUsers__form" onSubmit={(e) => e.preventDefault()}>
          <label className="offscreen" htmlFor="search">Order Search</label>
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
          <button className={filter === "inStock" ? "is-active" : ""} onClick={() => setFilter("inStock")}>In Stock</button>
          <button className={filter === "lowStock" ? "is-active" : ""} onClick={() => setFilter("lowStock")}>Low Stock</button>
          <button className={filter === "out_of_stock" ? "is-active" : ""} onClick={() => setFilter("out_of_stock")}>Out of Stock </button>
         
        </div>
      </nav>

      <section className="pagesUsers__section-p">
        <p>All Orders: {stats.all}</p>
        <p>In Stock: {stats.inStock}</p>
        <p>Low Stock: {stats.lowStock}</p>
        <p>Out of Stock: {stats.out_of_stock}</p>
      </section>


      {!isLoading && !error && !products.length && (
        <div className="empty-message">
          <p>No products yet. Start by adding your first product.</p>
        </div>
      )}


      <ProductsTable
        filteredProducts={filteredProducts}
        handleDelete={handleDeleteProductWithCascade}
        handleUser={handleEditStart}
        products={products}
      />

      <AddProducts
        newProducts={newProducts}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleEdit={handleSubmit}
        editingId={editingId}
      />
    </main>
  );
};


export default Products