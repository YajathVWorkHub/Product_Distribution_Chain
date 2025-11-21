import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerList() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => { const res = await axios.get("http://localhost:5000/customers"); setItems(res.data); };
  useEffect(()=>{ load(); },[]);

  const add = async (e) => { e.preventDefault(); await axios.post("http://localhost:5000/customers", form); setForm({ name: "", phone: "", email: "", address: "" }); load(); };
  const startEdit = (r) => { setEditingId(r.customer_id); setEditForm({ name: r.name, phone: r.phone, email: r.email, address: r.address }); };
  const cancel = () => { setEditingId(null); setEditForm({}); };
  const save = async (id) => { await axios.put(`http://localhost:5000/customers/${id}`, editForm); setEditingId(null); load(); };
  const del = async (id) => { if (!window.confirm("Delete?")) return; await axios.delete(`http://localhost:5000/customers/${id}`); load(); };

  return (
    <div style={{ padding: 20 }}>
      <h2>Customers</h2>
      <form onSubmit={add}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input placeholder="Address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/>
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(it=>(
            <tr key={it.customer_id}>
              <td>{it.customer_id}</td>
              <td>{editingId===it.customer_id ? <input value={editForm.name||""} onChange={e=>setEditForm({...editForm,name:e.target.value})}/> : it.name}</td>
              <td>{editingId===it.customer_id ? <input value={editForm.phone||""} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/> : it.phone}</td>
              <td>{editingId===it.customer_id ? <input value={editForm.email||""} onChange={e=>setEditForm({...editForm,email:e.target.value})}/> : it.email}</td>
              <td>{editingId===it.customer_id ? <input value={editForm.address||""} onChange={e=>setEditForm({...editForm,address:e.target.value})}/> : it.address}</td>
              <td>
                {editingId===it.customer_id ? <>
                  <button onClick={()=>save(it.customer_id)}>Save</button>
                  <button onClick={cancel}>Cancel</button>
                </> : <>
                  <button onClick={()=>startEdit(it)}>Edit</button>
                  <button onClick={()=>del(it.customer_id)}>Delete</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default CustomerList;
