import React, { useEffect, useState } from "react";
import { Button, Icon, IndexTable, Stack, DisplayText, Modal, TextField, Checkbox, TextStyle } from "@shopify/polaris";
import { DeleteMajor } from "@shopify/polaris-icons";
import { updateRedeemedList } from "../../../helpers/apiCalls.js";

const walletResourceName = {
  singular: "wallet address",
  plural: "wallet addresses",
};

const nftResourceName = {
  singular: "token address",
  plural: "token addresses",
};

const conditionTypeTabKeys = {
  solRpc: 'Solana Wallets',
  evmBasic: 'EVM Wallets'
};

const chainTabKeys = {
  polygon: 'Polygon NFTs',
  ethereum: 'Ethereum NFTs'
};

const RedeemedByEdit = ({currentEditedDraftOrder, openRedeemEdit, setOpenRedeemEdit, toggleGetAllDraftOrders}) => {
  let redeemObj = {};

  const [ conditionTypesTabs, setConditionTypesTabs ] = useState([]);
  const [ chainTabs, setChainTabs ] = useState([]);
  const [ tokenIdIsHexadecimal, setTokenIdIsHexadecimal ] = useState(false);
  const [ contractAddressTabs, setContractAddressTabs ] = useState([]);
  const [ updatedRedeemedList, setUpdatedRedeemedList ] = useState({});
  const [ originalRedeemList, setOriginalRedeemList ] = useState({});
  const [ tableData, setTableData ] = useState({});
  const [ tableDataKey, setTableDataKey ] = useState('');
  const [ typeOfRedeem, setTypeOfRedeem ] = useState('');
  const [ tableName, setTableName ] = useState('');

  const [ addressInput, setAddressInput ] = useState('');
  const [ tokenIdInput, setTokenIdInput ] = useState('');
  const [ numberOfUsesInput, setNumberOfUsesInput ] = useState('');
  const [ hexError, setHexError ] = useState('');

  useEffect(() => {
    if (currentEditedDraftOrder.draftOrderDetailsObj.typeOfRedeem === 'walletAddress') {
      setUpWalletEdit(currentEditedDraftOrder);
    } else if (currentEditedDraftOrder.draftOrderDetailsObj.typeOfRedeem === 'nftId') {
      console.log('currentEditedDraftOrder', currentEditedDraftOrder)
      setUpNftIdEdit(currentEditedDraftOrder)
    }
  }, [ currentEditedDraftOrder ])


  // NFT table functions.  this is set up assuming that only single condition access controls are made, so only one chain and contract address
  // needs to be considered.  it uses .split(') functions assuming that there will be expansion to multiple conditions later
  const setUpNftIdEdit = (currentEditedDraftOrder) => {
    setOriginalRedeemList(JSON.parse(JSON.stringify(currentEditedDraftOrder.parsedRedeemedNfts)));
    setUpdatedRedeemedList(JSON.parse(JSON.stringify(currentEditedDraftOrder.parsedRedeemedNfts)));

    const usedChains = currentEditedDraftOrder.usedChains.split(',');
    setChainTabs(usedChains);

    const contractAddresses = Object.keys(currentEditedDraftOrder.parsedRedeemedNfts[usedChains[0]]);
    if (contractAddresses.length) {
      setContractAddressTabs(contractAddresses);
    }

    setTypeOfRedeem(currentEditedDraftOrder.draftOrderDetailsObj.typeOfRedeem);
    assignNftIdTableData(currentEditedDraftOrder.parsedRedeemedNfts, usedChains[0], contractAddresses[0]);
  }

  const assignNftIdTableData = (entryData, key, contractAddress = null) => {
    const tableDataHolder = [];
    if (!!contractAddress) {
      for (let data in entryData[key][contractAddress]) {
        console.log('CHECK OUT DATA', entryData[key][contractAddress][data])
        const dataEntry = {
          tokenId: data,
          numberOfUses: entryData[key][contractAddress][data]
        }
        tableDataHolder.push(dataEntry);
      }
    }
    console.log('updatedRedeemList', updatedRedeemedList)

    setTableName(chainTabKeys[key]);
    setTableDataKey(key);
    setTableData(tableDataHolder);
  }

  const getBlockScanLink = (chain, contractAddress) => {
    if (chain === 'polygon') {
      return `https://polygonscan.com/address/${contractAddress}`
    } else if (chain === 'ethereum') {
      return `https://etherscan.io/address/${contractAddress}`
    }
  }

  const deleteNftIdEntry = (tokenId) => {
    const clonedRedeemList = updatedRedeemedList;
    console.log('cehcek delete', tableDataKey, contractAddressTabs[0], tokenId)
    delete clonedRedeemList[tableDataKey][contractAddressTabs[0]][tokenId];
    setUpdatedRedeemedList(clonedRedeemList);
    setTableData(clonedRedeemList[tableDataKey]);
    assignNftIdTableData(clonedRedeemList, tableDataKey, contractAddressTabs[0]);
    console.log('cloned redeem list', clonedRedeemList)
  }

  const addNftIdEntry = async () => {
    setHexError('');
    const updatedRedeemedListHolder = JSON.parse(JSON.stringify(updatedRedeemedList));
    let tokenIdHolder = '';

    if (!tokenIdIsHexadecimal) {
      try {
        tokenIdHolder = parseInt(tokenIdInput).toString(16);
        console.log('PARSE TOKEN ID HOLDER', tokenIdInput)
      } catch (err) {
        setHexError('Error parsing tokenId.')
        return;
      }
    } else {
      tokenIdHolder = tokenIdInput;
    }

    while (tokenIdHolder.length < 64) {
      tokenIdHolder = '0' + tokenIdHolder;
    }

    if (tokenIdInput.slice(0, 2) !== '0x') {
      tokenIdHolder = `0x${tokenIdHolder}`
    }

    console.log('tokenIdHolder', tokenIdHolder)
    console.log('check nest', updatedRedeemedListHolder)
    console.log('check tableDataKey', tableDataKey, updatedRedeemedListHolder[tableDataKey])
    console.log('check contractAddressTabs[0]', updatedRedeemedListHolder[tableDataKey][contractAddressTabs[0]])
    console.log('check tokenIdHolder', updatedRedeemedListHolder[tableDataKey][contractAddressTabs[0]][tokenIdHolder])

    updatedRedeemedListHolder[tableDataKey][contractAddressTabs[0]][tokenIdHolder] = numberOfUsesInput;
    setUpdatedRedeemedList(updatedRedeemedListHolder);

    assignNftIdTableData(updatedRedeemedListHolder, tableDataKey, contractAddressTabs[0]);
    setTokenIdInput('');
    setNumberOfUsesInput('');
  }

  const convertHexToDecimal = (tokenId) => {
    const tokenIdHolder = tokenId.slice(2);
    const parsedTokenId = parseInt(tokenIdHolder, 16);
    return parsedTokenId;
  }

  // Wallet address table setup
  const setUpWalletEdit = (currentEditedDraftOrder) => {
    setOriginalRedeemList(JSON.parse(JSON.stringify(currentEditedDraftOrder.parsedRedeemedBy)));
    setUpdatedRedeemedList(JSON.parse(JSON.stringify(currentEditedDraftOrder.parsedRedeemedBy)));

    const conditionTypes = currentEditedDraftOrder.conditionTypes.split(',');
    const conditionTypeTabs = conditionTypes.map(r => {
      return {
        key: r,
        title: conditionTypeTabKeys[r]
      };
    });
    setConditionTypesTabs(conditionTypeTabs);
    setTypeOfRedeem(currentEditedDraftOrder.draftOrderDetailsObj.typeOfRedeem);
    assignWalletAddressTableData(currentEditedDraftOrder.parsedRedeemedBy, conditionTypeTabs[0].key);
  }

  const assignWalletAddressTableData = (entryData, key) => {
    const tableDataHolder = [];

    for (let data in entryData[key]) {
      const dataEntry = {
        address: data,
        numberOfUses: entryData[key][data]
      }
      tableDataHolder.push(dataEntry);
    }

    setTableName(conditionTypeTabKeys[key]);
    setTableDataKey(key);
    setTableData(tableDataHolder);
  }

  const deleteWalletAddressEntry = (entry) => {
    const clonedRedeemList = updatedRedeemedList;
    delete clonedRedeemList[tableDataKey][entry];
    setUpdatedRedeemedList(clonedRedeemList);
    setTableData(clonedRedeemList[tableDataKey]);
    assignWalletAddressTableData(clonedRedeemList, tableDataKey);
  }

  const addWalletAddressEntry = async () => {
    const updatedRedeemedListHolder = JSON.parse(JSON.stringify(updatedRedeemedList));

    updatedRedeemedListHolder[tableDataKey][addressInput] = numberOfUsesInput;
    setUpdatedRedeemedList(updatedRedeemedListHolder);

    assignWalletAddressTableData(updatedRedeemedListHolder, tableDataKey);
    setAddressInput('');
    setNumberOfUsesInput('');
  }

  const saveNewEntries = async () => {
    const stringifiedRedeemList = JSON.stringify(updatedRedeemedList);

    try {
      const updateRes = await updateRedeemedList(stringifiedRedeemList, typeOfRedeem, currentEditedDraftOrder.id);
      await toggleGetAllDraftOrders();
      setOpenRedeemEdit(false);
    } catch (err) {
      console.log('Error updating redeemed list:', err);
    }
  }

  return (
    <Modal
      large
      open={openRedeemEdit}
      title="Edit User Redeem List"
      onClose={() => setOpenRedeemEdit(false)}
      primaryAction={{
        content: "Save",
        onAction: async () => {
          await saveNewEntries()
        },
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => {
            setUpdatedRedeemedList(originalRedeemList);
            if (typeOfRedeem === 'walletAddress') {
              assignWalletAddressTableData(originalRedeemList, tableDataKey);
              setAddressInput('');
              setNumberOfUsesInput('');
            } else if (typeOfRedeem === 'nftId') {

            }
            setOpenRedeemEdit(false);
          },
        },
      ]}
    >
      <Modal.Section>
        <div>
          <DisplayText size={'small'}>{tableName}</DisplayText>
          {typeOfRedeem === 'walletAddress' && (
            <div>
              <IndexTable selectable={false}
                          resourceName={walletResourceName}
                          itemCount={tableData.length}
                          headings={[
                            {title: 'Address'},
                            {title: 'Times redeemed'}
                          ]}
              >
                {tableData.map((tableEntry, index) => {
                  return (
                    <IndexTable.Row key={index} position={index}>
                      <IndexTable.Cell>
                        {tableEntry.address}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        {tableEntry.numberOfUses}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Button outline
                                onClick={() => {
                                  deleteWalletAddressEntry(tableEntry.address);
                                }}
                        >
                          <Icon source={DeleteMajor} color={"base"}/>
                        </Button>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  )
                })}
              </IndexTable>
              <p style={{marginBottom: '0.5em'}}><strong>Create or update entry</strong></p>
              <Stack alignment={'trailing'}>
                <Stack.Item fill>
                  <TextField autoComplete={'off'}
                             label={'Wallet Address'}
                             onChange={e => {
                               setAddressInput(e);
                             }}
                             value={addressInput}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField autoComplete={'off'}
                             label={'Times Redeemed'}
                             onChange={e => {
                               setNumberOfUsesInput(e)
                             }}
                             type={"number"}
                             value={numberOfUsesInput}/>
                </Stack.Item>
                <Stack.Item>
                  <Button primary
                          disabled={!addressInput.length || !numberOfUsesInput.length}
                          onClick={() => {
                            addWalletAddressEntry();
                          }}>
                    Create or update entry
                  </Button>
                </Stack.Item>
              </Stack>
            </div>
          )}
          {typeOfRedeem === 'nftId' && (
            <div>
              {!!contractAddressTabs[0] && (
                <Stack>
                  <p>Contract Address: <strong>{contractAddressTabs[0]}</strong> - </p>
                  <a target={'_blank'} href={getBlockScanLink(tableDataKey, contractAddressTabs[0])}>View on block
                    explorer</a>
                </Stack>
              )}
              <IndexTable selectable={false}
                          resourceName={nftResourceName}
                          itemCount={tableData.length}
                          headings={[
                            {title: 'Token ID'},
                            {title: 'Times redeemed'}
                          ]}
              >
                {tableData.map((tableEntry, index) => {
                  return (
                    <IndexTable.Row key={index} position={index}>
                      <IndexTable.Cell>
                        {convertHexToDecimal(tableEntry.tokenId)}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        {tableEntry.numberOfUses}
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <Button outline
                                onClick={() => {
                                  deleteNftIdEntry(tableEntry.tokenId);
                                }}
                        >
                          <Icon source={DeleteMajor} color={"base"}/>
                        </Button>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  )
                })}
              </IndexTable>
              <p style={{marginBottom: '0.5em'}}><strong>Create or update entry</strong></p>
              <Stack alignment={"trailing"}>
                <Stack.Item fill>
                  <TextField autoComplete={'off'}
                             label={'Token ID'}
                             onChange={e => {
                               setTokenIdInput(e);
                             }}
                             value={tokenIdInput}/>
                </Stack.Item>
                <Stack.Item>
                  <TextField autoComplete={'off'}
                             label={'Times Redeemed'}
                             onChange={e => {
                               setNumberOfUsesInput(e)
                             }}
                             type={"number"}
                             value={numberOfUsesInput}/>
                </Stack.Item>
                <Stack.Item>
                  <Button primary
                          disabled={!tokenIdInput.length || !numberOfUsesInput.length}
                          onClick={() => {
                            addNftIdEntry();
                          }}>
                    Create or update entry
                  </Button>
                </Stack.Item>
              </Stack>
              <Checkbox label={'Token ID is hexadecimal'}
                        checked={tokenIdIsHexadecimal}
                        onChange={setTokenIdIsHexadecimal}/>
              <Stack>
                <TextStyle variation={'negative'}>{hexError}</TextStyle>
              </Stack>
            </div>
          )}
        </div>
      </Modal.Section>
    </Modal>
  )
}

export default RedeemedByEdit;
