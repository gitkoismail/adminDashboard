
const CustomersTable = ( {filteredCustomers, handleDelete, handleUser} ) => {

    const customersFunc = filteredCustomers.map((user) => (
       <tr key={user.id}>
            <th scope="row" className="section-userTable__item">{user.fullName}</th>
            <td className="section-userTable__item">{user.email}</td>
            <td className="section-userTable__item">{user.phone}</td>
            <td className="section-userTable__item">{user.company}</td>
            <td className="section-userTable__item">{user.city}</td>
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
                    <th scope="col" className="section-userTable__header">Full Name</th>
                    <th scope="col" className="section-userTable__header">Email</th>
                    <th scope="col" className="section-userTable__header">Phone</th>
                    <th scope="col" className="section-userTable__header">Company</th>
                    <th scope="col" className="section-userTable__header">City</th>
                    <th scope="col" className="section-userTable__header">Status</th>
                    <th scope="col" className="section-userTable__header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {customersFunc}
            </tbody>
        </table>
    </section>
  )
}

export default CustomersTable