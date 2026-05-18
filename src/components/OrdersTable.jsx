
const ProductsTable = ( {filteredOrders, handleDelete, handleUser} ) => {

    const orderFunc = filteredOrders.map((user) => (
       <tr key={user.id}>
            <th scope="row" className="section-userTable__item">{user.customerName}</th>
            <td className="section-userTable__item">{user.productName}</td>
            <td className="section-userTable__item">{user.quantity}</td>
            <td className="section-userTable__item">{user.totalAmount}</td>
            <td className={`section-userTable__item status-${user.paymentStatus.toLowerCase()}`}>{user.paymentStatus}</td>
            <td className={`section-userTable__item status-${user.orderStatus.toLowerCase()}`}>{user.orderStatus}</td>
            <td className="section-userTable__item">
                <button type="button" onClick={() => handleDelete(user.id)}>
                Delete</button>
                <button type="button" onClick={() => handleUser(user.id)}>
                Edit</button></td>
       </tr>
    ))

  return (
    <section className="section-userTable">
        <table className="section-customerTable__container">
            <thead>
                <tr>
                    <th scope="col" className="section-userTable__header">Customer Name</th>
                    <th scope="col" className="section-userTable__header">Product Name</th>
                    <th scope="col" className="section-userTable__header">Quantity</th>
                    <th scope="col" className="section-userTable__header">Total Amount</th>
                    <th scope="col" className="section-userTable__header">Payment Status</th>
                    <th scope="col" className="section-userTable__header">Order Status</th>
                    <th scope="col" className="section-userTable__header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {orderFunc}
            </tbody>
        </table>
    </section>
  )
}

export default ProductsTable