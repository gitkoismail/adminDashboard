
const AddCustomer = ( {newProducts, handleChange, handleSubmit, editingId} ) => {

  return (
    <form className="userAddForm" onSubmit={handleSubmit}>
        <label className="offscreen" htmlFor="productName">Product Name</label>
        <input 
            type="text"
            id="productName"
            name="productName"
            required
            autoFocus
            placeholder="Monster Notebook"
            value={newProducts.productName}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="category">Category</label>
        <input 
            type="text"
            id="category"
            name="category"
            required
            placeholder="Electronic"
            value={newProducts.category}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="price">Price</label>
        <input 
            type="text"
            id="price"
            name="price"
            required
            placeholder="2000"
            value={newProducts.price}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="stock">Stock</label>
        <input 
            type="text"
            id="stock"
            name="stock"
            required
            placeholder="10"
            value={newProducts.stock}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="sku">Sku</label>
        <input 
            type="text"
            id="sku"
            name="sku"
            required
            placeholder="MR32SX"
            value={newProducts.sku}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="status">Status</label>
        <select 
            id="status"
            name="status"
            required
            value={newProducts.status}
            onChange={handleChange}
        >
            <option value="">Select Payment Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
        </select>
                <button 
                    type="submit"
                    aria-label="Add Item"
                >{editingId ? "Save Changes" : "Add"}</button>   
    </form>
  );
};

export default AddCustomer