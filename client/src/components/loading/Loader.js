import React, { useContext, useEffect, useState } from "react";

import Web3Context from "../../context/web3/Web3Context";
import UserContext from "../../context/user/UserContext";
import TradeContext from "../../context/trade/TradeContext";

const Loader = () => {
  const web3Context = useContext(Web3Context);
  const { connected, ArcaCalls, ErcCalls } = web3Context;

  const userContext = useContext(UserContext);
  const userAdd = userContext.user.addressObj.address;
  const partnerAdd = userContext.tradePartner.addressObj.address;

  const tradeContext = useContext(TradeContext);
  const {
    setUserAccepted,
    setPartnerAccepted,
    setUserItems,
    setPartnerItems
  } = tradeContext;

  const initialState = {
    loading: false
  };

  const [user, setUser] = useState(initialState);
  const [partner, setPartner] = useState(initialState);

  const getAccepted = (_add1, _add2) => {
    const nonces = [];
    nonces.push(ArcaCalls("getNonce", [userAdd, partnerAdd]));
    nonces.push(ArcaCalls("getPartnerNonce", [userAdd, partnerAdd]));
    return new Promise((resolve, reject) =>
      Promise.all(nonces)
        .then(nonces => {
          console.log(nonces);
          resolve(+nonces[0] + 1 === +nonces[1]);
        })
        .catch(e => reject(e))
    );
  };

  const getErc20s = (_erc20Count, _add1, _add2) => {
    if (!connected) return;
    const erc20Promises = [];

    for (let i = 0; i < _erc20Count; i++) {
      erc20Promises.push(ArcaCalls("getOfferErc20", [_add1, _add2, i]));
    }

    const offers = [];

    return new Promise((resolve, reject) =>
      Promise.all(erc20Promises)
        .then(erc20s => {
          erc20s.map((erc20, i) => {
            let offer = {
              id: "0-" + i,
              network: { slot: i },
              data: { type: "erc20", contractAdd: "", amount: "" }
            };
            [offer.data.contractAdd, offer.data.amount] = [
              erc20[0].toString(), //contractAdd
              erc20[1].toString() //amount
            ];
            offers.push(offer);
          });
          resolve(offers);
        })
        .catch(e => reject(e))
    );
  };

  const getErc721s = (_erc721Count, _add1, _add2) => {
    if (!connected) return;
    const erc721Promises = [];

    for (let i = 0; i < _erc721Count; i++) {
      erc721Promises.push(ArcaCalls("getOfferErc721", [_add1, _add2, i]));
    }

    const offers = [];

    return new Promise((resolve, reject) =>
      Promise.all(erc721Promises)
        .then(erc721s => {
          erc721s.map((erc721, i) => {
            let offer = {
              id: "1-" + i,
              network: { slot: i },
              data: { type: "erc721", contractAdd: "", id: "" }
            };
            [offer.data.contractAdd, offer.data.id] = [
              erc721[0].toString(), //contractAdd
              erc721[1].toString() //id
            ];
            offers.push(offer);
          });
          resolve(offers);
        })
        .catch(e => reject(e))
    );
  };

  const load = () => {
    if (user.loading || partner.loading) return;
    setUser(initialState);
    setPartner(initialState);

    if (!connected) {
      console.log("Not Connected");
      return;
    }

    setUser({ loading: true });
    setPartner({ loading: true });
    console.log("Loading");

    const userPromises = [];
    const partnerPromises = [];

    userPromises.push(
      new Promise((resolve, reject) =>
        getAccepted(userAdd, partnerAdd)
          .then(accepted => resolve(accepted))
          .catch(e => reject(e))
      )
    );

    userPromises.push(
      new Promise((resolve, reject) =>
        ArcaCalls("getErc20Count", [userAdd, partnerAdd]).then(erc20Count => {
          getErc20s(+erc20Count, userAdd, partnerAdd)
            .then(erc20s => resolve(erc20s))
            .catch(e => reject(e));
        })
      )
    );

    userPromises.push(
      new Promise((resolve, reject) =>
        ArcaCalls("getErc721Count", [userAdd, partnerAdd]).then(erc721Count => {
          getErc721s(+erc721Count, userAdd, partnerAdd)
            .then(erc721s => resolve(erc721s))
            .catch(e => reject(e));
        })
      )
    );

    partnerPromises.push(
      new Promise((resolve, reject) =>
        getAccepted(partnerAdd, userAdd)
          .then(accepted => resolve(accepted))
          .catch(e => reject(e))
      )
    );

    partnerPromises.push(
      new Promise((resolve, reject) =>
        ArcaCalls("getErc20Count", [partnerAdd, userAdd]).then(erc20Count => {
          getErc20s(+erc20Count, partnerAdd, userAdd)
            .then(erc20s => resolve(erc20s))
            .catch(e => reject(e));
        })
      )
    );

    partnerPromises.push(
      new Promise((resolve, reject) =>
        ArcaCalls("getErc721Count", [partnerAdd, userAdd]).then(erc721Count => {
          getErc721s(+erc721Count, partnerAdd, userAdd)
            .then(erc721s => resolve(erc721s))
            .catch(e => reject(e));
        })
      )
    );

    Promise.all(userPromises)
      .then(res => {
        setUserAccepted([res[0]]);
        setUserItems([...res[1], ...res[2]]);
        setUser({ loading: false });
      })
      .catch(e => {
        console.log(e);
        setUser({ loading: false });
      });
    Promise.all(partnerPromises)
      .then(res => {
        setPartnerAccepted([res[0]]);
        setPartnerItems([...res[1], ...res[2]]);
        setUser({ loading: false });
      })
      .catch(e => {
        console.log(e);
        setUser({ loading: false });
      });
  };

  //Hook based async
  useEffect(() => {
    load();
  }, [userAdd, partnerAdd]);

  return (
    <button className="btn btn-dark" onClick={load}>
      Reload
    </button>
  );
  //return null;
};

export default Loader;
