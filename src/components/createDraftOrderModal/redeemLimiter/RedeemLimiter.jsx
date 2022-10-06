import React, { Fragment, useEffect, useState } from "react";
import {
  Stack,
  Checkbox,
  Button,
  Select,
  TextField
} from "@shopify/polaris";

const RedeemLimiter = ({
                         unifiedAccessControlConditions,
                         hasRedeemLimit,
                         setHasRedeemLimit,
                         draftOrderRedeemLimit,
                         setDraftOrderRedeemLimit,
                         typeOfRedeem,
                         setTypeOfRedeem,
                         disabled
                       }) => {

  const [ isAbleToUseNftId, setIsAbleToUseNftId ] = useState(false);

  const typeOfRedeemOptions = [
    {label: "By Wallet Address", value: "walletAddress"},
    {label: "By NFT ID", value: "nftId"},
  ];

  useEffect(() => {
    if (!unifiedAccessControlConditions || unifiedAccessControlConditions.length > 1) {
      setIsAbleToUseNftId(false);
    } else if (unifiedAccessControlConditions[0].chain !== 'ethereum' && unifiedAccessControlConditions[0].chain !== 'polygon') {
      setIsAbleToUseNftId(false);
    } else if (unifiedAccessControlConditions['0'].method !== 'balanceOf') {
      setIsAbleToUseNftId(false);
    } else {
      setIsAbleToUseNftId(true);
    }

  }, [ hasRedeemLimit,
    unifiedAccessControlConditions,
    setHasRedeemLimit,
    draftOrderRedeemLimit,
    setDraftOrderRedeemLimit,
    typeOfRedeem,
    setTypeOfRedeem ]);


  return (
    <Fragment>
      {unifiedAccessControlConditions?.length && (
        <div style={{borderTop: '1px solid #777', paddingTop: '1em'}}>
          <p style={{'color': 'blue'}}><strong>Note:</strong> Redemption limiting by <strong>NFT
            ID</strong> works
            with
            single conditions (no
            multiple or
            nested
            conditions), and with NFTs on Ethereum and Polygon. Cannot be used with pre-populate.</p>
          <Checkbox
            disabled={disabled}
            label="Limit number of times a user can redeem"
            checked={hasRedeemLimit}
            onChange={setHasRedeemLimit}
          />
          <div style={{marginTop: '0.5rem'}}></div>
          {hasRedeemLimit && (
            <Stack>
              <Select
                label={"Type of redeem limit"}
                options={isAbleToUseNftId ? typeOfRedeemOptions : [ typeOfRedeemOptions[0] ]}
                onChange={(e) => setTypeOfRedeem(e)}
                value={typeOfRedeem}
              />
              <TextField
                type={"number"}
                label={"How many times can a user redeem the offer?"}
                helpText={"0 or leaving the box empty means no limit"}
                value={draftOrderRedeemLimit}
                onChange={setDraftOrderRedeemLimit}
                autoComplete={"off"}
              />
            </Stack>
          )}
        </div>
      )}
    </Fragment>
  )
}

export default RedeemLimiter;
