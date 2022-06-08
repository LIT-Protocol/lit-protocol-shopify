import React, { useState } from "react";
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
  TextStyle,
  Layout,
  List,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import ProductTable from "./ProductTable";
import { checkIfProductHasBeenUsed } from "../../helpers/apiCalls.js";

const CreateDraftOrderModal = (props) => {
  const [showProductSelect, setShowProductSelect] = useState(false);

  const [draftOrderTitle, setDraftOrderTitle] = useState("");
  const [draftOrderDiscount, setDraftOrderDiscount] = useState("0");
  const [draftOrderRedeemLimit, setDraftOrderRedeemLimit] = useState("0");
  const [draftOrderOriginalPrice, setDraftOrderOriginalPrice] = useState("10");
  const [draftOrderProduct, setDraftOrderProduct] = useState(null);
  const [draftOrderDescription, setDraftOrderDescription] = useState(null);

  const [typeOfAccessControl, setTypeOfAccessControl] = useState("exclusive");
  const [errorText, setErrorText] = useState(null);

  const typeOfAccessOptions = [
    { label: "Exclusive Access", value: "exclusive" },
    { label: "Discount", value: "discount" },
  ];

  const getChains = (accArray, chains = []) => {
    console.log('check accArray', accArray)
    const chainHolder = [...chains];
    accArray.forEach((a) => {
      if (Array.isArray(a)) {
        const getNestedChains = getChains(a, chainHolder);
        chainHolder.push(getNestedChains);
      } else if (a['conditionType'] && chainHolder.indexOf(a['conditionType']) < 0) {
        chainHolder.push(a.conditionType)
      }
    })
    return chainHolder;
  }

  const exportDraftOrder = () => {
    if (!draftOrderRedeemLimit || draftOrderRedeemLimit < 1) {
      setDraftOrderRedeemLimit(null);
    }

    const draftOrderDetails = {
      id: draftOrderProduct.id,
      quantity: 1,
      title: draftOrderTitle,
      description: draftOrderDescription,
      price: draftOrderOriginalPrice,
      redeemLimit: draftOrderRedeemLimit,
      value: draftOrderDiscount,
      valueType: "PERCENTAGE",
    };

    if (typeOfAccessControl === "exclusive") {
      draftOrderDetails.value = 0;
    }

    console.log('check conditionTypes', getChains(props.unifiedAccessControlConditions))

    const draftOrderObj = {
      title: draftOrderTitle,
      access_control_conditions: JSON.stringify(props.unifiedAccessControlConditions),
      humanized_access_control_conditions:
      props.humanizedAccessControlConditions,
      asset_type: typeOfAccessControl,
      asset_id_on_service: draftOrderProduct.id,
      user_id: "",
      draft_order_details: JSON.stringify(draftOrderDetails),
      summary: `${draftOrderDiscount}% off ${draftOrderProduct.title}`,
      extra_data: getChains(props.unifiedAccessControlConditions).join(', '),
      active: true,
      shop_id: props.shopInfo.shopId,
      shop_name: props.shopInfo.name,
    };

    if (typeOfAccessControl === "exclusive") {
      draftOrderObj.summary = `Token gated ${draftOrderProduct.title}`;
    } else {
      draftOrderObj.summary = `${draftOrderDiscount}% off ${draftOrderProduct.title}`;
    }

    clearDraftOrder();

    props.sendDraftOrderToDb(draftOrderObj);
  };

  // TODO: remove search for price after MVP demo
  const getVariantPrice = (product) => {
    return product.selection[0].variants[0].price;
  };

  const saveProducts = async (products) => {
    const productHasAlreadyBeenUsed = await checkIfProductHasBeenUsed(
      products.selection[0].id
    );
    console.log('---> productHasAlreadyBeenUsed', productHasAlreadyBeenUsed);
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
    props.setUnifiedAccessControlConditions(null);
    props.setPermanent(true);
  };

  const clearDraftOrder = () => {
    setDraftOrderTitle("");
    setDraftOrderDiscount("0");
    setDraftOrderRedeemLimit("0");
    setDraftOrderDescription("");
    setTypeOfAccessControl("exclusive");
    setShowProductSelect(false);
    setDraftOrderProduct(null);
    setErrorText(null);
    clearAccessControlCondition();
  };

  const checkIfButtonDisabled = () => {
    if (!draftOrderTitle || !draftOrderProduct) return true;
    if (typeOfAccessControl === "discount" && !draftOrderDiscount) return true;
    return false;
  };

  return (
    <div>
      <Modal
        large
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
        <Modal.Section>
          <Form>
            <FormLayout>
              <div>
                <TextContainer>
                  {!!errorText && (
                    <Layout>
                      <Layout.Section>
                        <TextStyle variation="negative">
                          This product has already been used in entry entitled:{" "}
                          <strong>{errorText}</strong>
                        </TextStyle>
                      </Layout.Section>
                      <Layout.Section>
                        <TextStyle variation="negative">
                          Using a single product in multiple
                          discounts/exclusives in not currently supported, but
                          will be soon.
                        </TextStyle>
                      </Layout.Section>
                    </Layout>
                  )}
                  <div>
                    {!!draftOrderProduct && draftOrderProduct["id"] ? (
                      <ProductTable
                        productId={[draftOrderProduct.id]}
                        setDraftOrderProduct={setDraftOrderProduct}
                        draftOrderProduct={draftOrderProduct}
                      />
                    ) : (
                      <Stack align="center">
                        <Button onClick={() => setShowProductSelect(true)}>
                          Choose Product
                        </Button>
                        {!props.hideInstructions && (
                          <TextStyle>
                            <List>
                              <List.Item>
                                Select a product to put behind token access.
                              </List.Item>
                            </List>
                          </TextStyle>
                        )}
                      </Stack>
                    )}
                  </div>
                  <Stack alignment={"center"}>
                    <Stack.Item fill>
                      <TextField
                        label={"Title"}
                        value={draftOrderTitle}
                        onChange={setDraftOrderTitle}
                        autoComplete={"off"}
                      />
                    </Stack.Item>
                    <Stack.Item>
                      {!props.hideInstructions && (
                        <TextStyle>
                          <List>
                            <List.Item>Enter a title for the discount.</List.Item>
                          </List>
                        </TextStyle>
                      )}
                    </Stack.Item>
                  </Stack>
                  <Stack>
                    <Stack.Item>
                      <Select
                        label={"Type of Access"}
                        options={typeOfAccessOptions}
                        onChange={(e) => setTypeOfAccessControl(e)}
                        value={typeOfAccessControl}
                      />
                    </Stack.Item>
                    {typeOfAccessControl === "discount" && (
                      <Stack.Item>
                        <TextField
                          type={"number"}
                          label={"Discount Amount"}
                          suffix="% off"
                          align={"right"}
                          value={draftOrderDiscount}
                          onChange={setDraftOrderDiscount}
                          autoComplete={"off"}
                        />
                      </Stack.Item>
                    )}
                    <Stack.Item fill>

                    </Stack.Item>
                    <Stack.Item>
                      <TextField type={"number"}
                                 label={'How many times can a user redeem the offer?'}
                                 helpText={"0 or leaving the box empty means no limit"}
                                 value={draftOrderRedeemLimit}
                                 onChange={setDraftOrderRedeemLimit}
                                 autoComplete={"off"}

                      />
                    </Stack.Item>
                    {!props.hideInstructions && (
                      <TextStyle>
                        <List style={{ color: "" }}>
                          <List.Item>
                            Select whether to gate product as exclusive or
                            discounted.
                          </List.Item>
                          <List.Item>
                            Once all fields are completed, the{" "}
                            <strong>Next</strong> button will be enabled. Click
                            it to create access control conditions.
                          </List.Item>
                          <List.Item>
                            <strong>
                              We highly recommend cloning a product template for
                              use with products marked 'exclusive'.
                            </strong>{" "}
                            Directions can be found in our docs under
                            <a
                              href={
                                "https://lit-services-docs.netlify.app/docs/shopify-docs/creating-a-new-product-template"
                              }
                              target="_blank"
                            >
                              <strong style={{ color: "#5E36B7" }}>
                                {" "}
                                Creating a new product template.
                              </strong>
                            </a>
                          </List.Item>
                        </List>
                      </TextStyle>
                    )}
                  </Stack>
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
