import React from "react";

export default {
  exampleWidget: (dataAttributes: NamedNodeMap) => {
    console.log("Example Widget", dataAttributes);
    console.log("Example Widget", React);
    return <div>Example Widget</div>;
  },
};
