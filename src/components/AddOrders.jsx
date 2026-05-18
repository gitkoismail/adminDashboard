const AddOrders = ({
  newOrders,
  handleChange,
  handleSubmit,
  editingId,
  products = [],
  customers = [],
}) => {
  return (
    <form className="userAddForm" onSubmit={handleSubmit}>
      <label className="offscreen" htmlFor="customerId">
        Customer Name
      </label>
      <select
        id="customerId"
        name="customerId"
        value={newOrders.customerId}
        onChange={handleChange}
        required
      >
        <option value="">Select Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.fullName}
          </option>
        ))}
      </select>

      <label className="offscreen" htmlFor="productId">
        Product Name
      </label>
      <select
        id="productId"
        name="productId"
        value={newOrders.productId}
        onChange={handleChange}
        required
      >
        <option value="">Select Product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.productName}
          </option>
        ))}
      </select>

      <label className="offscreen" htmlFor="quantity">
        Quantity
      </label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        required
        min="1"
        placeholder="1"
        value={newOrders.quantity}
        onChange={handleChange}
      />

      <label className="offscreen" htmlFor="paymentStatus">
        Payment Status
      </label>
      <select
        id="paymentStatus"
        name="paymentStatus"
        required
        placeholder="Paid / Unpaid / Refunded"
        value={newOrders.paymentStatus}
        onChange={handleChange}
      >
        <option value="">Select Payment Status</option>
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
        <option value="Refunded">Refunded</option>
      </select>
 
      <label className="offscreen" htmlFor="orderStatus">
        Order Status
      </label>
      <select
        id="orderStatus"
        name="orderStatus"
        required
        value={newOrders.orderStatus}
        onChange={handleChange}
      >
        <option value="">Select Order Status</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>

      </select>

      <button type="submit" aria-label="Add Item">
        {editingId ? "Save Changes" : "Add"}
      </button>
    </form>
  );
};

export default AddOrders;