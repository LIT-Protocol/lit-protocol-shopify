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
  Checkbox,
  List,
} from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
import ProductTable from "./ProductTable";
import RedeemLimiter from "./redeemLimiter/RedeemLimiter.jsx";
import { humanizeAccessControlConditions } from "lit-js-sdk";

const CreateDraftOrderModal = (props) => {
  const [ showProductSelect, setShowProductSelect ] = useState(false);

  const [ draftOrderTitle, setDraftOrderTitle ] = useState("");
  const [ draftOrderDiscount, setDraftOrderDiscount ] = useState("0");
  const [ draftOrderRedeemLimit, setDraftOrderRedeemLimit ] = useState("1");
  const [ draftOrderProducts, setDraftOrderProducts ] = useState([]);
  const [ draftOrderDescription, setDraftOrderDescription ] = useState("");
  // const [ productsAreExclusive, setProductsAreExclusive ] = useState(false);
  // const [ exclusivePrice, setExclusivePrice ] = useState('');

  const [ typeOfAccessControl, setTypeOfAccessControl ] = useState("exclusive");
  const [ typeOfRedeem, setTypeOfRedeem ] = useState("walletAddress");
  const [ hasRedeemLimit, setHasRedeemLimit ] = useState(false);
  const [ errorText, setErrorText ] = useState(null);

  const typeOfAccessOptions = [
    {label: "Exclusive Access", value: "exclusive"},
    {label: "Discount", value: "discount"},
  ];

  const getConditionTypes = (accArray, conditionTypes = []) => {
    const conditionTypesHolder = [ ...conditionTypes ];
    accArray.forEach((a) => {
      if (Array.isArray(a)) {
        const getNestedChains = getConditionTypes(a, conditionTypesHolder);
        conditionTypesHolder.push(getNestedChains);
      } else if (
        a["conditionType"] &&
        conditionTypesHolder.indexOf(a["conditionType"]) < 0
      ) {
        conditionTypesHolder.push(a.conditionType);
      }
    });
    return conditionTypesHolder;
  };

  const getChains = (accArray, chains = []) => {
    const chainsHolder = [ ...chains ];
    accArray.forEach((a) => {
      if (Array.isArray(a)) {
        const getNestedChains = getConditionTypes(a, chainsHolder);
        chainsHolder.push(getNestedChains);
      } else if (
        a["chain"] &&
        chainsHolder.indexOf(a["chain"]) < 0
      ) {
        chainsHolder.push(a.chain);
      }
    });
    return chainsHolder;
  };

  const exportDraftOrder = () => {
    if (!draftOrderRedeemLimit || draftOrderRedeemLimit < 1) {
      setDraftOrderRedeemLimit(null);
    }

    const draftOrderProductIds = draftOrderProducts.map(p => {
      return p.id;
    })

    const usedChains = getChains(props.unifiedAccessControlConditions).join(",");
    const conditionTypes = getConditionTypes(props.unifiedAccessControlConditions).join(", ");

    const draftOrderDetails = {
      id: draftOrderProductIds,
      quantity: 1,
      title: draftOrderTitle,
      description: draftOrderDescription,
      typeOfRedeem: typeOfRedeem,
      typeOfAccessControl: typeOfAccessControl,
      hasRedeemLimit: hasRedeemLimit,
      redeemLimit: draftOrderRedeemLimit,
      value: draftOrderDiscount,
      valueType: "PERCENTAGE",
      usedChains,
      conditionTypes
    };

    if (typeOfAccessControl === "exclusive") {
      draftOrderDetails.value = 0;
    }

    console.log(
      "check conditionTypes",
      getConditionTypes(props.unifiedAccessControlConditions)
    );

    let productTitles = '';
    for (let i = 0; i < draftOrderProducts.length; i++) {
      console.log('productTitles index', i, draftOrderProducts.length)
      if (i === 0) {
        productTitles = productTitles.concat(`${draftOrderProducts[i].title}`);
      } else if (i < draftOrderProducts.length - 1) {
        productTitles = productTitles.concat(`, ${draftOrderProducts[i].title}`);
      } else {
        productTitles = productTitles.concat(` and ${draftOrderProducts[i].title}`);
      }
    }

    const draftOrderObj = {
      // metadata for discount
      humanized_access_control_conditions: props.humanizedAccessControlConditions,
      access_control_conditions: JSON.stringify(
        props.unifiedAccessControlConditions
      ),
      used_chains: usedChains,
      condition_types: conditionTypes,

      // metadata for shopify draft order
      shop_id: props.shopInfo.shopId,
      shop_name: props.shopInfo.name,
      offer_type: typeOfAccessControl,
      asset_id_on_service: JSON.stringify(draftOrderProductIds),
      draft_order_details: JSON.stringify(draftOrderDetails),
      redeem_type: typeOfRedeem,

      // information displayed to users
      title: draftOrderTitle,
      description: draftOrderDescription,
      asset_name_on_service: productTitles,
      summary: productTitles,
      discount: typeOfAccessControl === 'exclusive' ? '' : draftOrderDiscount,

      user_id: "",
      extra_data: '',
      active: true,
    };

    clearDraftOrder();

    props.sendDraftOrderToDb(draftOrderObj);
  };

  const saveProducts = async (products) => {
    setDraftOrderProducts(products.selection);
    setErrorText(null);
    setShowProductSelect(false);
  };

  const clearAccessControlCondition = () => {
    setTypeOfRedeem('walletAddress');
    setHasRedeemLimit(false);
    props.setHumanizedAccessControlConditions(null);
    props.setUnifiedAccessControlConditions(null);
    props.setPermanent(true);
  };

  const clearDraftOrder = () => {
    setDraftOrderTitle("");
    setDraftOrderDiscount("0");
    setDraftOrderRedeemLimit("1");
    setDraftOrderDescription("");
    setTypeOfAccessControl("exclusive");
    setHasRedeemLimit(false);
    setTypeOfRedeem('walletAddress');
    setShowProductSelect(false);
    setDraftOrderProducts(null);
    setErrorText(null);
    clearAccessControlCondition();
  };

  const checkIfButtonDisabled = () => {
    if (!draftOrderTitle || !draftOrderProducts || !draftOrderProducts.length) return true;
    if (typeOfAccessControl === "discount" && !draftOrderDiscount) return true;
    return false;
  };

  return (
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
                <div>
                  {!!draftOrderProducts && draftOrderProducts.length ? (
                    <ProductTable
                      setDraftOrderProducts={setDraftOrderProducts}
                      draftOrderProducts={draftOrderProducts}
                    />
                  ) : (
                    <Stack align="center">
                      <Button onClick={() => setShowProductSelect(true)}>
                        Choose Product(s)
                      </Button>
                      {!props.hideInstructions && (
                        <TextStyle>
                          <List>
                            <List.Item>
                              Select product(s) to put behind token access.
                            </List.Item>
                          </List>
                        </TextStyle>
                      )}
                    </Stack>
                  )}
                </div>
                <Stack alignment={"center"}>
                  <Stack.Item>
                    <TextField
                      label={"Title"}
                      value={draftOrderTitle}
                      onChange={setDraftOrderTitle}
                      autoComplete={"off"}
                    />
                  </Stack.Item>
                  {/*<Stack.Item>*/}
                  {/*  {!props.hideInstructions && (*/}
                  {/*    <TextStyle>*/}
                  {/*      <List>*/}
                  {/*        <List.Item>*/}
                  {/*          Enter a title for the offer.*/}
                  {/*        </List.Item>*/}
                  {/*      </List>*/}
                  {/*    </TextStyle>*/}
                  {/*  )}*/}
                  {/*</Stack.Item>*/}
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
                <Stack alignment={"center"}>
                  <Stack.Item fill>
                    <TextField
                      label={"Description (if no description is provided, humanized access control conditions will be displayed)"}
                      value={draftOrderDescription}
                      onChange={setDraftOrderDescription}
                      autoComplete={"off"}
                    />
                  </Stack.Item>
                  <Stack.Item>
                    {!props.hideInstructions && (
                      <TextStyle>
                        <List>
                          <List.Item>
                            Enter a description that users will see for this offer. If no description is made, the
                            humanized access control conditions will display.
                          </List.Item>
                        </List>
                      </TextStyle>
                    )}
                  </Stack.Item>
                </Stack>
                {/*<Stack>*/}
                {/*  <Select*/}
                {/*    label={"Type of Access"}*/}
                {/*    options={typeOfAccessOptions}*/}
                {/*    onChange={(e) => setTypeOfAccessControl(e)}*/}
                {/*    value={typeOfAccessControl}*/}
                {/*  />*/}
                {/*  {typeOfAccessControl === "discount" && (*/}
                {/*    <TextField*/}
                {/*      type={"number"}*/}
                {/*      label={"Discount Amount"}*/}
                {/*      suffix="% off"*/}
                {/*      align={"right"}*/}
                {/*      value={draftOrderDiscount}*/}
                {/*      onChange={setDraftOrderDiscount}*/}
                {/*      autoComplete={"off"}*/}
                {/*    />*/}
                {/*  )}*/}
                {/*  <Stack.Item fill></Stack.Item>*/}
                {/*</Stack>*/}
                <Stack>
                  {!props.hideInstructions && (
                    <TextStyle>
                      <List style={{color: ""}}>
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
                            <strong style={{color: "#5E36B7"}}>
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
                    <Heading>Access Control Conditions Summary</Heading>
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
                <div style={{marginTop: '1rem'}}></div>
                <RedeemLimiter unifiedAccessControlConditions={props.unifiedAccessControlConditions}
                               hasRedeemLimit={hasRedeemLimit}
                               setHasRedeemLimit={setHasRedeemLimit}
                               typeOfRedeem={typeOfRedeem}
                               setTypeOfRedeem={setTypeOfRedeem}
                               draftOrderRedeemLimit={draftOrderRedeemLimit}
                               setDraftOrderRedeemLimit={setDraftOrderRedeemLimit}
                />
              </TextContainer>
            </div>
            <ResourcePicker
              onSelection={saveProducts}
              resourceType={"Product"}
              allowMultiple={true}
              open={showProductSelect}
              onCancel={() => {
                setShowProductSelect(false);
              }}
            />
          </FormLayout>
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default CreateDraftOrderModal;
