import { DataTable, Button } from "@shopify/polaris";
import React, { useState, useEffect } from "react";
import { useQuery } from "react-apollo";
import { GET_PRODUCT_DATA } from "../../../server/handlers/queries/get-product-data";

const ProductTable = ({ id, draftOrderProduct, setDraftOrderProduct }) => {
  const [dataTableEntries, setDataTableEntries] = useState(null);

  useEffect(() => {
    console.log("draftOrderProduct", draftOrderProduct);
    const modifyProductInfo = [
      draftOrderProduct.title,
      draftOrderProduct.id,
      <Button onClick={() => setDraftOrderProduct(null)}>Remove</Button>,
    ];
    console.log("modifyProductInfo", modifyProductInfo);
    setDataTableEntries([modifyProductInfo]);
  }, [draftOrderProduct]);

  return (
    <span>
      {!!dataTableEntries && (
        <DataTable
          columnContentTypes={["text", "text", "text"]}
          headings={["Title", "ID", "Delete"]}
          rows={dataTableEntries}
        />
      )}
    </span>
  );
};

export default ProductTable;
