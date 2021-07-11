import React from "react";
import Component from "./Component";
import "react-virtualized/styles.css";

import data from "./data.json";
const TestContainer = () => {
  const selectOrderGroup = item => {
    console.log("selectOrderGroup: ", item);
  };

  return <Component rows={data} selectOrderGroup={selectOrderGroup} />;
};

export default TestContainer;