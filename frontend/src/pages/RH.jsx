import React from "react";
import ListAttes from "../components/RH/AttestationsTravail";
import ViewAttes from "./ViewAttes";
import TabDocs from "../components/RH_docs";

const RH = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center m-10 ">
      {/* <ListAttes></ListAttes> */}
      {/* <ViewAttes></ViewAttes> */}
      <TabDocs></TabDocs>
    </div>
  );
};

export default RH;
