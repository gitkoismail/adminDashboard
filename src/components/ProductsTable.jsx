
const ProductsTable = ( {filteredProducts, handleDelete, handleUser} ) => {

    const productFunc = filteredProducts.map((user) => (
       <tr key={user.id}>
            <th scope="row" className="section-userTable__item">{user.productName}</th>
            <td className="section-userTable__item">{user.category}</td>
            <td className="section-userTable__item">{user.price}</td>
            <td className="section-userTable__item">{user.stock}</td>
            <td className="section-userTable__item">{user.sku}</td>
            <td className={`section-userTable__item status-${user.status.toLowerCase()}`}>{user.status}</td>
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
                    <th scope="col" className="section-userTable__header">Product Name</th>
                    <th scope="col" className="section-userTable__header">Category</th>
                    <th scope="col" className="section-userTable__header">Price</th>
                    <th scope="col" className="section-userTable__header">Stock</th>
                    <th scope="col" className="section-userTable__header">Sku</th>
                    <th scope="col" className="section-userTable__header">Status</th>
                    <th scope="col" className="section-userTable__header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {productFunc}
            </tbody>
        </table>
    </section>
  )
}

export default ProductsTable