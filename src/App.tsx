import React from "react";
import AddressBook from "./components/AddressBook";
import { Header } from "./components/Header";

function App() {
  return (
    <div className="App">
      <div className="Container">
        <Header />
        <AddressBook />
      </div>
    </div>
  );
}

export default App;
