const AddCustomer = ( {newCustomers, handleChange, handleSubmit, editingId} ) => {

  return (
    <form className="userAddForm" onSubmit={handleSubmit}>
        <label className="offscreen" htmlFor="fullName">Full Name</label>
        <input 
            type="text"
            id="fullName"
            name="fullName"
            required
            autoFocus
            placeholder="İsmail Koçoğlu"
            value={newCustomers.fullName}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="email">Email</label>
        <input 
            type="text"
            id="email"
            name="email"
            required
            placeholder="Somerandom@gmail.com"
            value={newCustomers.email}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="phone">Phone</label>
        <input 
            type="text"
            id="phone"
            name="phone"
            required
            placeholder="0555 555 55 55"
            value={newCustomers.phone}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="company">Company</label>
        <input 
            type="text"
            id="company"
            name="company"
            required
            placeholder="Koç Holding"
            value={newCustomers.company}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="city">City</label>
        <input 
            type="text"
            id="city"
            name="city"
            required
            placeholder="İzmir"
            value={newCustomers.city}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="status">Status</label>
        <select 
            id="status"
            name="status"
            required
            value={newCustomers.status}
            onChange={handleChange}
        >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="VIP">VIP</option>
            <option value="Leads">Leads</option>
            <option value="Churn Risk">Churn Risk</option>
        </select>
                <button 
                    type="submit"
                    aria-label="Add Item"
                >{editingId ? "Save Changes" : "Add"}</button>
        
        
    </form>
  )
}

export default AddCustomer