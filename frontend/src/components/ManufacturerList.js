import React, { useEffect, useState } from "react";
import axios from "axios";

function ManufacturerList() {
  const [manufacturers, setManufacturers] = useState([]);
  const [form, setForm] = useState({ name: "", contact_person: "", phone: "", email: "", address: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    const res = await axios.get("http://localhost:5000/manufacturers");
    setManufacturers(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/manufacturers", form);
    setForm({ name: "", contact_person: "", phone: "", email: "", address: "" });
    load();
  };

  const startEdit = (m) => {
    setEditingId(m.manufacturer_id);
    setEditForm({ name: m.name, contact_person: m.contact_person, phone: m.phone, email: m.email, address: m.address });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:5000/manufacturers/${id}`, editForm);
    setEditingId(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manufacturer?")) return;
    await axios.delete(`http://localhost:5000/manufacturers/${id}`);
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Manufacturers</h2>

      <form onSubmit={handleAdd} style={{ marginBottom: 12 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Contact person" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Contact</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {manufacturers.map(m => (
            <tr key={m.manufacturer_id}>
              <td>{m.manufacturer_id}</td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <input value={editForm.name || ""} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                ) : m.name}
              </td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <input value={editForm.contact_person || ""} onChange={e => setEditForm({ ...editForm, contact_person: e.target.value })} />
                ) : m.contact_person}
              </td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <input value={editForm.phone || ""} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                ) : m.phone}
              </td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <input value={editForm.email || ""} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                ) : m.email}
              </td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <input value={editForm.address || ""} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
                ) : m.address}
              </td>

              <td>
                {editingId === m.manufacturer_id ? (
                  <>
                    <button onClick={() => saveEdit(m.manufacturer_id)}>Save</button>
                    <button onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(m)}>Edit</button>
                    <button onClick={() => handleDelete(m.manufacturer_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManufacturerList;
