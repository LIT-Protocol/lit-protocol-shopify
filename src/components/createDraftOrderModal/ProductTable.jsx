import { DataTable, Button } from "@shopify/polaris";
import React, { useState, useEffect } from "react";

const ProductTable = ({draftOrderProducts, setDraftOrderProducts}) => {
  const [ dataTableEntries, setDataTableEntries ] = useState([]);

  useEffect(() => {
    const modifyProductInfo = draftOrderProducts.map(p => {
      return [
        p.title,
        p.id,
        <Button onClick={() => removeProduct(p.id)}>Remove</Button> ]
    });
    setDataTableEntries(modifyProductInfo);
  }, [ draftOrderProducts ]);

  const removeProduct = (id) => {
    const filteredProducts = draftOrderProducts.filter(p => p.id !== id);
    console.log('filteredProducts', filteredProducts)
    setDraftOrderProducts(filteredProducts);
  }

  return (
    <span>
      {!!dataTableEntries && (
        <DataTable
          columnContentTypes={[ "text", "text", "text" ]}
          headings={[ "Title", "ID", "Delete" ]}
          rows={dataTableEntries}
        />
      )}
    </span>
  );
};

export default ProductTable;
