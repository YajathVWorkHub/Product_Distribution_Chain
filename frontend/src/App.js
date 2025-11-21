import React from "react";
import ManufacturerList from "./components/ManufacturerList";
import DistributorList from "./components/DistributorList";
import RetailerList from "./components/RetailerList";
import CustomerList from "./components/CustomerList";
import OrderList from "./components/OrderList";

function App(){
  return (
    <div style={{ padding: 20 }}>
      <h1>Product Distribution Dashboard</h1>
      <ManufacturerList />
      <hr />
      <DistributorList />
      <hr />
      <RetailerList />
      <hr />
      <CustomerList />
      <hr />
      <OrderList />
    </div>
  );
}
export default App;
