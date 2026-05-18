
const StaffTable = ( {filteredStaff, handleDelete, handleUser} ) => {

    const staffFunc = filteredStaff.map((user) => (
       <tr key={user.id}>
            <th scope="row" className="section-userTable__item">{user.department}</th>
            <td className="section-userTable__item">{user.name}</td>
            <td className="section-userTable__item">{user.email}</td>
            <td className="section-userTable__item">{user.role}</td>
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
        <table className="section-userTable__container">
            <thead>
                <tr>
                    <th scope="col" className="section-userTable__header">Department</th>
                    <th scope="col" className="section-userTable__header">Name</th>
                    <th scope="col" className="section-userTable__header">Email</th>
                    <th scope="col" className="section-userTable__header">Role</th>
                    <th scope="col" className="section-userTable__header">Status</th>
                    <th scope="col" className="section-userTable__header">Actions</th>
                </tr>
            </thead>
            <tbody>
                {staffFunc}
            </tbody>
        </table>
    </section>
  )
}

export default StaffTable