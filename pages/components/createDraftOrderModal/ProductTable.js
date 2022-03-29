import { DataTable, Button } from "@shopify/polaris";
import React, { useState, useEffect } from "react";

const ProductTable = ({ id, draftOrderProduct, setDraftOrderProduct }) => {
  const [dataTableEntries, setDataTableEntries] = useState(null);

  useEffect(() => {
    const modifyProductInfo = [
      draftOrderProduct.title,
      draftOrderProduct.id,
      <Button onClick={() => setDraftOrderProduct(null)}>Remove</Button>,
    ];

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
