import React, { useEffect, useState } from "react";
import axios from "axios";

const ORDER_TYPES = ["Manufacturer->Distributor","Distributor->Retailer","Retailer->Customer"];
const STATUSES = ["Placed","In Transit","Delivered","Cancelled"];

function OrderList() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    order_type: ORDER_TYPES[0], source_id: "", destination_id: "", order_date: "",
    status: STATUSES[0], total_amount: "", payment_method: "Cash",
    order_items: [{ product_id: "", quantity: "", unit_price: "" }]
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    const res = await axios.get("http://localhost:5000/orders");
    setItems(res.data);
  };
  useEffect(() => { load(); }, []);

  // add / remove item rows in the order create form
  const addItemRow = () => setForm({...form, order_items: [...form.order_items, {product_id:"", quantity:"", unit_price:""}]});
  const removeItemRow = (index) => {
    const arr = [...form.order_items]; arr.splice(index,1);
    setForm({...form, order_items: arr});
  };
  const updateItemRow = (index, key, val) => {
    const arr = [...form.order_items]; arr[index][key] = val; setForm({...form, order_items: arr});
  };

  const add = async (e) => {
    e.preventDefault();
    const payload = {
      order_type: form.order_type,
      source_id: Number(form.source_id),
      destination_id: Number(form.destination_id),
      order_date: form.order_date || null,
      status: form.status,
      total_amount: Number(form.total_amount || 0),
      payment_method: form.payment_method,
      order_items: form.order_items
        .filter(i => i.product_id !== "" && i.quantity !== "")
        .map(i => ({ product_id: Number(i.product_id), quantity: Number(i.quantity), unit_price: Number(i.unit_price || 0) }))
    };

    try {
      const res = await axios.post("http://localhost:5000/orders", payload);
      console.log("Created order:", res.data);
      setForm({ order_type: ORDER_TYPES[0], source_id: "", destination_id: "", order_date: "", status: STATUSES[0], total_amount: "", payment_method: "Cash", order_items:[{product_id:"",quantity:"",unit_price:""}]});
      load();
    } catch (err) {
      console.error(err);
      alert("Error creating order: " + (err.response?.data?.error || err.message));
    }
  };

  const startEdit = (o) => {
    setEditingId(o.order_id);
    setEditForm({
      order_type: o.order_type, source_id: o.source_id, destination_id: o.destination_id,
      order_date: o.order_date ? o.order_date.slice(0,10) : "", status: o.status
    });
  };
  const cancel = () => { setEditingId(null); setEditForm({}); };

  const save = async (id) => {
    const payload = { ...editForm };
    try {
      await axios.put(`http://localhost:5000/orders/${id}`, payload);
      setEditingId(null); load();
    } catch (err) {
      console.error(err); alert("Update failed");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Delete order?")) return;
    await axios.delete(`http://localhost:5000/orders/${id}`);
    load();
  };

  const markDelivered = async (id) => {
    if (!window.confirm("Mark this order as Delivered?")) return;
    try {
      await axios.put(`http://localhost:5000/orders/${id}`, { status: "Delivered" });
      load();
      alert("Order marked Delivered — trigger should update inventory if items/inventory exist.");
    } catch (err) {
      console.error(err); alert("Failed to mark delivered");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Orders</h2>

      <form onSubmit={add} style={{ marginBottom: 12 }}>
        <select value={form.order_type} onChange={e=>setForm({...form,order_type:e.target.value})}>
          {ORDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Source ID" value={form.source_id} onChange={e=>setForm({...form,source_id:e.target.value})} />
        <input placeholder="Destination ID" value={form.destination_id} onChange={e=>setForm({...form,destination_id:e.target.value})} />
        <input type="date" value={form.order_date} onChange={e=>setForm({...form,order_date:e.target.value})} />
        <input placeholder="Total amount" value={form.total_amount} onChange={e=>setForm({...form,total_amount:e.target.value})} />
        <select value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}>
          <option>Cash</option><option>Card</option><option>BankTransfer</option>
        </select>

        <div style={{ marginTop: 8 }}>
          <b>Order Items</b>
          {form.order_items.map((it, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input placeholder="product_id" value={it.product_id} onChange={e=>updateItemRow(idx,"product_id",e.target.value)} />
              <input placeholder="quantity" value={it.quantity} onChange={e=>updateItemRow(idx,"quantity",e.target.value)} />
              <input placeholder="unit_price" value={it.unit_price} onChange={e=>updateItemRow(idx,"unit_price",e.target.value)} />
              <button type="button" onClick={()=>removeItemRow(idx)}>Remove</button>
            </div>
          ))}
          <div style={{ marginTop: 6 }}>
            <button type="button" onClick={addItemRow}>Add Item Row</button>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <button type="submit">Create Order</button>
        </div>
      </form>

      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Type</th><th>Source</th><th>Destination</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map(it => (
            <tr key={it.order_id}>
              <td>{it.order_id}</td>
              <td>{editingId===it.order_id ? <select value={editForm.order_type||""} onChange={e=>setEditForm({...editForm,order_type:e.target.value})}>{ORDER_TYPES.map(t=> <option key={t} value={t}>{t}</option>)}</select> : it.order_type}</td>
              <td>{editingId===it.order_id ? <input value={editForm.source_id||""} onChange={e=>setEditForm({...editForm,source_id:e.target.value})}/> : it.source_id}</td>
              <td>{editingId===it.order_id ? <input value={editForm.destination_id||""} onChange={e=>setEditForm({...editForm,destination_id:e.target.value})}/> : it.destination_id}</td>
              <td>{editingId===it.order_id ? <input type="date" value={editForm.order_date||""} onChange={e=>setEditForm({...editForm,order_date:e.target.value})}/> : (it.order_date ? it.order_date.slice(0,10) : "")}</td>
              <td>{editingId===it.order_id ? <select value={editForm.status||""} onChange={e=>setEditForm({...editForm,status:e.target.value})}>{STATUSES.map(s=> <option key={s} value={s}>{s}</option>)}</select> : it.status}</td>
              <td>
                {editingId===it.order_id ? <>
                  <button onClick={()=>save(it.order_id)}>Save</button>
                  <button onClick={cancel}>Cancel</button>
                </> : <>
                  <button onClick={()=>startEdit(it)}>Edit</button>
                  <button onClick={()=>del(it.order_id)}>Delete</button>
                  <button onClick={()=>markDelivered(it.order_id)}>Mark Delivered</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
