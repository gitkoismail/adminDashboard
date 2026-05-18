const AddStaff = ( {newStaff, handleChange, handleSubmit, editingId} ) => {

  return (
    <form className="userAddForm" onSubmit={handleSubmit}>
        <label className="offscreen" htmlFor="department">Department</label>
        <input 
            type="text"
            id="department"
            name="department"
            required
            autoFocus
            placeholder="Development"
            value={newStaff.department}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="name">Full Name</label>
        <input 
            type="text"
            id="name"
            name="name"
            required
            placeholder="İsmail Koçoğlu"
            value={newStaff.name}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="email">Email</label>
        <input 
            type="text"
            id="email"
            name="email"
            required
            placeholder="ismail@gmail.com"
            value={newStaff.email}
            onChange={handleChange}
        />
        <label className="offscreen" htmlFor="role">Role</label>
        <input 
            type="text"
            id="role"
            name="role"
            required
            placeholder="Developer"
            value={newStaff.role}
            onChange={handleChange}
        />
                <button 
                    type="submit"
                    aria-label="Add Item"
                >{editingId ? "Save Changes" : "Add"}</button>
        
        
    </form>
  )
}

export default AddStaff