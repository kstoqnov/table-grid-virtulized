import React from "react";
import Component from "./Component";
import "react-virtualized/styles.css";
import data from "./data.json";

const columns = [
  { width: 40, maxWidth: 40, label: "", dataKey: "open", flexGrow: 1 },
  {
      width: 200,
      label: "Order Group Description",
      dataKey: "description",
      flexGrow: 1
  },
  { width: 100, label: "Item Number", dataKey: "itemNumber", flexGrow: 1 },
  {
      width: 200,
      label: "Item Description",
      dataKey: "itemDescription",
      flexGrow: 1
  },
  { width: 60, label: "", dataKey: "select", flexGrow: 1 }
];

const TestContainer = () => {
  const selectOrderGroup = item => {
    console.log("selectOrderGroup: ", item);
  };

  return <Component rows={data} columns={columns} selectOrderGroup={selectOrderGroup} />;
};

export default TestContainer;