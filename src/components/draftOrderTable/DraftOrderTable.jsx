import React, { useEffect, useState } from "react";
import {
  Card,
  IndexTable,
  TextStyle,
  Button,
  Modal,
  Icon,
  TextContainer,
  Stack
} from "@shopify/polaris";
import {
  EditMajor, DeleteMajor
} from '@shopify/polaris-icons';
import './DraftOrderTable.css';
import RedeemedByEdit from "./redeeemedByEdit/RedeemedByEdit.jsx";

const redeemLimitTypes = {
  nftId: 'NFT ID',
  walletAddress: 'Wallet Address'
}

const DraftOrderTable = (props) => {
  const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState(false);
  const [ currentEditedDraftOrder, setCurrentEditedDraftOrder ] = useState(null);
  const [ draftOrders, setDraftOrders ] = useState([]);
  const [ openRedeemEdit, setOpenRedeemEdit ] = useState(false);
  const [ originalRedeemList, setOriginalRedeemList ] = useState({});
  const [ updatedRedeemList, setUpdatedRedeemList ] = useState({});
  const [ redeemEditTabData, setRedeemEditTabData ] = useState({});

  useEffect(() => {
    if (!!props.draftOrders) {
      const mappedDraftOrders = props.draftOrders.map((d) => {
        console.log('d', d)
        const mappedDraftOrder = d;
        mappedDraftOrder["draftOrderDetailsObj"] = JSON.parse(
          d.draftOrderDetails
        );
        mappedDraftOrder['parsedRedeemedBy'] = JSON.parse(
          d.redeemedBy
        )
        mappedDraftOrder['parsedRedeemedNfts'] = JSON.parse(
          d.redeemedNfts
        )
        return mappedDraftOrder;
      });
      setDraftOrders(mappedDraftOrders);
    }
  }, [ props.draftOrders ]);

  const toggleOpenRedeemEdit = (draftOrder) => {
    setCurrentEditedDraftOrder(draftOrder);
    setOpenRedeemEdit(true);
  }

  const resourceName = {
    singular: "draft order",
    plural: "draft orders",
  };

  return (
    <div>
      <Card className={"draftOrders-table-container"}>
        <Card.Section>
          <Button onClick={() => props.setOpenCreateDraftOrderModal(true)}>
            Create Token Access
          </Button>
        </Card.Section>
        {draftOrders.length > 0 && (
          <Card.Section>
            <IndexTable
              selectable={false}
              resourceName={resourceName}
              itemCount={!props.draftOrders ? 0 : props.draftOrders.length}
              headings={[
                {title: "Title"},
                {title: "Summary"},
                {title: "Redeem Limit"},
                {title: "Access Control Conditions"},
                {title: "Chain(s) Used"},
                {title: ""},
              ]}
            >
              {draftOrders && draftOrders.map((draftOrder, index) => (
                <IndexTable.Row id={index} key={index} position={index}>
                  <IndexTable.Cell>
                    <TextStyle variation="strong">{draftOrder.title}</TextStyle>
                  </IndexTable.Cell>
                  {/*<IndexTable.Cell><strong>{draftOrder.summary[0]}%</strong>off of<strong>${draftOrder.summary[1]}</strong></IndexTable.Cell>*/}
                  <IndexTable.Cell>{draftOrder.summary}</IndexTable.Cell>
                  <IndexTable.Cell>
                    {!draftOrder.draftOrderDetailsObj.hasRedeemLimit ? (
                      <p style={{marginLeft: '2.6em'}}>None</p>
                    ) : (
                      <Stack alignment={'center'} wrap={false}>
                        <Stack.Item>
                          <Button plain onClick={() => {
                            toggleOpenRedeemEdit(draftOrder);
                          }}>
                            <Icon source={EditMajor}
                                  color={"base"}/>
                          </Button>
                        </Stack.Item>
                        <Stack.Item fill>
                          <p>{redeemLimitTypes[draftOrder.draftOrderDetailsObj.typeOfRedeem]}</p>
                        </Stack.Item>
                      </Stack>
                    )}
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    {!!draftOrder.accessControlConditions ? (
                      <span>
                        <p className={'humanized-conditions-cell'}>{draftOrder.humanizedAccessControlConditions}</p>
                      </span>
                    ) : (
                      <p>No access control conditions</p>
                    )}
                  </IndexTable.Cell>
                  <IndexTable.Cell>{draftOrder.usedChains}</IndexTable.Cell>
                  <IndexTable.Cell>
                    <Button outline
                            onClick={() => {
                              setCurrentEditedDraftOrder(draftOrder);
                              setOpenDeleteConfirmation(true);
                            }}
                    >
                      <Icon source={DeleteMajor} color={"base"}/>
                    </Button>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </Card.Section>
        )}
      </Card>
      {openDeleteConfirmation && (
        <Modal
          open={openDeleteConfirmation}
          title="Are you sure you want to delete this draft order?"
          onClose={() => setOpenDeleteConfirmation(false)}
          primaryAction={{
            content: "Yes, delete",
            onAction: () => {
              props.handleDeleteDraftOrder(currentEditedDraftOrder);
              setOpenDeleteConfirmation(false);
            },
          }}
          secondaryActions={[
            {
              content: "No, do not delete",
              onAction: () => setOpenDeleteConfirmation(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                You are about to delete the promotion{" "}
                <strong>{currentEditedDraftOrder.title}.</strong>
              </p>
            </TextContainer>
          </Modal.Section>
        </Modal>
      )}
      {openRedeemEdit && (
        <RedeemedByEdit currentEditedDraftOrder={currentEditedDraftOrder}
                        openRedeemEdit={openRedeemEdit}
                        setOpenRedeemEdit={setOpenRedeemEdit}
                        toggleGetAllDraftOrders={props.toggleGetAllDraftOrders}
                        hideInstructions={props.hideInstructions}
        />
      )}
    </div>
  );
};

export default DraftOrderTable;
