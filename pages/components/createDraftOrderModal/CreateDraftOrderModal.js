import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormLayout,
  Modal,
  TextField,
  Stack,
  Select,
  TextContainer,
  Button,
  Heading,
} from "@shopify/polaris";
import styles from "../createDraftOrderModal/create-draft-order-modal.module.scss";
import { ResourcePicker } from "@shopify/app-bridge-react";
import ProductTable from "./ProductTable";
import { checkIfProductHasBeenUsed } from "../../../server/apiCalls";

const CreateDraftOrderModal = (props) => {
  const [showProductSelect, setShowProductSelect] = useState(false);

  const [draftOrderTitle, setDraftOrderTitle] = useState("");
  const [draftOrderDiscount, setDraftOrderDiscount] = useState("0");
  const [draftOrderOriginalPrice, setDraftOrderOriginalPrice] = useState("10");
  const [draftOrderProduct, setDraftOrderProduct] = useState(null);
  const [draftOrderDescription, setDraftOrderDescription] = useState(null);

  const [typeOfAccessControl, setTypeOfAccessControl] = useState("exclusive");
  const [errorText, setErrorText] = useState(null);

  const typeOfAccessOptions = [
    { label: "Exclusive Access", value: "exclusive" },
    { label: "Discount", value: "discount" },
  ];

  const exportDraftOrder = () => {
    const draftOrderDetails = {
      id: draftOrderProduct.id,
      quantity: 1,
      title: draftOrderTitle,
      description: draftOrderDescription,
      price: draftOrderOriginalPrice,
      value: draftOrderDiscount,
      valueType: "PERCENTAGE",
    };

    if (typeOfAccessControl === "exclusive") {
      draftOrderDetails.value = 0;
    }

    const draftOrderObj = {
      title: draftOrderTitle,
      access_control_conditions: JSON.stringify(props.accessControlConditions),
      humanized_access_control_conditions:
        props.humanizedAccessControlConditions,
      asset_type: typeOfAccessControl,
      asset_id_on_service: draftOrderProduct.id,
      user_id: "",
      draft_order_details: JSON.stringify(draftOrderDetails),
      summary: `${draftOrderDiscount}% off ${draftOrderProduct.title}`,
      extra_data: props.accessControlConditions[0].chain,
      active: true,
      shop_id: props.shopInfo.shopId,
    };

    if (typeOfAccessControl === "exclusive") {
      draftOrderObj.summary = `Token gated ${draftOrderProduct.title}`;
    } else {
      draftOrderObj.summary = `${draftOrderDiscount}% off ${draftOrderProduct.title}`;
    }

    console.log("---> DRAFT ORDER OBJECT", draftOrderObj);

    clearDraftOrder();

    props.sendDraftOrderToDb(draftOrderObj);
  };

  // TODO: remove search for price after MVP demo
  const getVariantPrice = (product) => {
    return product.selection[0].variants[0].price;
  };

  const saveProducts = async (products) => {
    console.log("Products", products);
    const productHasAlreadyBeenUsed = await checkIfProductHasBeenUsed(
      products.selection[0].id
    );
    console.log("productHasAlreadyBeenUsed", productHasAlreadyBeenUsed);
    if (!!productHasAlreadyBeenUsed.data.length) {
      const product = productHasAlreadyBeenUsed.data[0];
      setErrorText(product.title);
    } else {
      const productPrice = getVariantPrice(products);
      setDraftOrderOriginalPrice(productPrice);
      const product = products.selection[0];
      setDraftOrderProduct(product);
      setErrorText(null);
    }
    setShowProductSelect(false);
  };

  const clearAccessControlCondition = () => {
    props.setHumanizedAccessControlConditions(null);
    props.setAccessControlConditions(null);
  };

  const clearDraftOrder = () => {
    setDraftOrderTitle("");
    setDraftOrderDiscount("0");
    setDraftOrderDescription("");
    setTypeOfAccessControl("exclusive");
    setShowProductSelect(false);
    setDraftOrderProduct(null);
    setErrorText(null);
    clearAccessControlCondition();
  };

  const checkIfButtonDisabled = () => {
    if (
      // !props.humanizedAccessControlConditions ||
      !draftOrderTitle ||
      !draftOrderProduct
    )
      return true;
    if (typeOfAccessControl === "discount" && !draftOrderDiscount) return true;
    return false;
  };

  return (
    <div>
      <Modal
        large
        className={styles.createDraftOrderForm}
        open={props.open}
        title={"Create New Token Access"}
        onClose={() => {
          clearDraftOrder();
          props.setOpenCreateDraftOrderModal(false);
        }}
        primaryAction={{
          disabled: checkIfButtonDisabled(),
          content: props.humanizedAccessControlConditions
            ? "Save Token Access"
            : "Next",
          onAction: () => {
            if (!!props.humanizedAccessControlConditions) {
              exportDraftOrder();
            } else {
              props.handleCreateAccessControl();
            }
          },
        }}
      >
        <Modal.Section className={styles.modalFormContainer}>
          <Form>
            <FormLayout>
              <div className={styles.selectionCard}>
                <TextContainer>
                  {!!errorText && (
                    <div>
                      <div className={styles.errorText}>
                        This product has already been used in entry entitled:{" "}
                        <strong>{errorText}</strong>
                      </div>
                      <div className={styles.errorText}>
                        Using a single product in multiple discounts/exclusives
                        in not currently supported, but will be soon.
                      </div>
                    </div>
                  )}
                  <div>
                    {!!draftOrderProduct && draftOrderProduct["id"] ? (
                      <ProductTable
                        productId={[draftOrderProduct.id]}
                        setDraftOrderProduct={setDraftOrderProduct}
                        draftOrderProduct={draftOrderProduct}
                      />
                    ) : (
                      <Button onClick={() => setShowProductSelect(true)}>
                        Choose Product
                      </Button>
                    )}
                  </div>
                  <TextField
                    label={"Title"}
                    value={draftOrderTitle}
                    onChange={setDraftOrderTitle}
                    autoComplete={"off"}
                    style={{ maxWidth: "5rem" }}
                  />
                  <Stack alignment={"center"}>
                    <Select
                      label={"Type of Access"}
                      options={typeOfAccessOptions}
                      onChange={(e) => setTypeOfAccessControl(e)}
                      value={typeOfAccessControl}
                    />
                    {typeOfAccessControl === "discount" && (
                      <TextField
                        type={"number"}
                        label={"Discount Amount"}
                        suffix="% off"
                        align={"right"}
                        value={draftOrderDiscount}
                        onChange={setDraftOrderDiscount}
                        autoComplete={"off"}
                      />
                    )}
                  </Stack>
                  {/*<TextField*/}
                  {/*  label={*/}
                  {/*    "Discount Description (optional)"*/}
                  {/*  }*/}
                  {/*  value={draftOrderDescription}*/}
                  {/*  onChange={setDraftOrderDescription}*/}
                  {/*  autoComplete={"off"}*/}
                  {/*/>*/}
                  {/*</TextContainer>*/}
                  {/*  // <TextContainer>*/}
                  {props.humanizedAccessControlConditions && (
                    <div>
                      <Heading>Access Control Conditions</Heading>
                      <Stack alignment={"center"}>
                        <Stack.Item fill>
                          <p>{props.humanizedAccessControlConditions}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <Button onClick={() => clearAccessControlCondition()}>
                            Remove
                          </Button>
                        </Stack.Item>
                      </Stack>
                    </div>
                  )}
                </TextContainer>
              </div>
              <ResourcePicker
                onSelection={saveProducts}
                resourceType={"Product"}
                allowMultiple={false}
                open={showProductSelect}
                onCancel={() => {
                  setShowProductSelect(false);
                }}
              />
            </FormLayout>
          </Form>
        </Modal.Section>
      </Modal>
    </div>
  );
};

export default CreateDraftOrderModal;
