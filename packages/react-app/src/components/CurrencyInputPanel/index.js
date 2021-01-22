import React, { useState, useEffect } from 'react';
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import styled from 'styled-components';
// import useWeb3Modal from "../../hooks/useWeb3Modal";
import { ChainId, Token, WETH, Fetcher, Route } from '@uniswap/sdk'

// const projectId = "66fbccb2856b40b3a622d925568379e9";
// const projectSecret = "275ed56f36e440e0ab7cad94a3310aae";



export default function CurrencyInputPanel({ provider }) {
  const [ETHAmount, setETHAmount] = useState(0);
  const [SYCAmount, setSYCAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totoken, setTotoken] = useState(true);


  useEffect(() => {
    const fetchPrice = async () => {
      if (!isNaN(ETHAmount) && ETHAmount && totoken) {
        setSYCAmount(await getPairAmount())
      } else if (!isNaN(SYCAmount) && SYCAmount && !totoken) {
        setETHAmount(await getPairAmount())
      } else if (ETHAmount === '' || SYCAmount === '') {
        setSYCAmount('');
        setETHAmount('');
      } 
    }
    fetchPrice();
  }, [ETHAmount, SYCAmount, totoken]);


  async function getPairAmount() {
    try {
      const SycWethExchangeContract = new Contract(addresses[RINKEBY_ID].pairs["SYC-WETH"], abis.pair, provider);
      const reserves = await SycWethExchangeContract.getReserves();
      // reserves[0] is SYC, reserves[1] is ETHER
      const k = reserves[0].mul(reserves[1])
      let ETHAmountSubFee, SYCAmountSubFee, x, y;
      // fee to dev 0.3%
      if (totoken) {
        ETHAmountSubFee = (parseFloat(ETHAmount) * 0.997).toString();
        y = ethers.utils.parseUnits(ETHAmountSubFee, "ether").add(reserves[1])
        x = ethers.utils.formatEther(reserves[0].sub(k.div(y)));

      } else {
        SYCAmountSubFee = (parseFloat(SYCAmount) * 0.997).toString();
        y = ethers.utils.parseUnits(SYCAmountSubFee, "ether").add(reserves[0])
        x = ethers.utils.formatEther(reserves[1].sub(k.div(y)));

      }
      return x.toString();

    } catch (err) {
      console.log(err)
    }
  }

  function changeDirection() {
    setTotoken(!totoken);
    setSYCAmount('');
    setETHAmount('');
  }

  async function onSwap() {
    try {
      setLoading(true);
      const signer = provider.getSigner()
      const implemetationContract = new Contract(addresses[RINKEBY_ID].implementation, abis.implemetation, signer);
      let tx = await implemetationContract.swapETHToSyc({ value: ethers.utils.parseEther(ETHAmount) });
      setLoading(false);
      console.log(tx);
    } catch (err) {
      console.log(err)
    }
    setLoading(false);
  }

  if (totoken) {
    return (
      <div>
        <div className="ui container" style={{ marginTop: "20px" }}>
          <div className="ui big form">
            <div className="ui grid">
              <div className="field six wide column">
                <label>Amount</label>
                <div className="ui right labeled input">
                  <input type="text" onChange={e => setETHAmount(e.target.value)} value={ETHAmount} />
                  <div class="ui dropdown label">
                    <div class="text">ETH</div>
                  </div>
                </div>
              </div>
              <div className="field four wide column center aligned">
                <button class="ui icon basic button" style={{ boxShadow: 'none'}} onClick={changeDirection}>
                  <i className="fas fa-exchange-alt fa-2x"></i>
                </button>
              </div>
              <div className="field six wide column">
                <label>Amount to be received (estimated)</label>
                <div className="ui right labeled input">
                  <input type="text" disabled="disabled" value={SYCAmount} />
                  <div class="ui basic label">
                    SYC
                  </div>
                </div>
              </div>
            </div>
            <div className={`ui submit button right floated ${loading ? 'loading' : ''}`} onClick={onSwap}>Swap</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="ui container" style={{ marginTop: "20px" }}>
          <div className="ui big form">
            <div className="ui grid">
              <div className="field six wide column">
                <label>Amount</label>
                <div className="ui right labeled input">
                  <input type="text" onChange={e => setSYCAmount(e.target.value)} value={SYCAmount} />
                  <div class="ui dropdown label">
                    <div class="text">SYC</div>
                  </div>
                </div>
              </div>
              <div className="field four wide column center aligned">
                <button class="ui icon basic button" style={{ boxShadow: 'none'}} onClick={changeDirection}>
                  <i className="fas fa-exchange-alt fa-2x"></i>
                </button>
              </div>
              <div className="field six wide column">
                <label>Amount to be received (estimated)</label>
                <div className="ui right labeled input">
                  <input type="text" disabled="disabled" value={ETHAmount} />
                  <div class="ui basic label">
                    ETH
                  </div>
                </div>
              </div>
            </div>
            <div className={`ui submit button right floated ${loading ? 'loading' : ''}`} onClick={onSwap}>Swap</div>
            <div className={`ui submit button right floated ${loading ? 'loading' : ''}`} onClick={onSwap}>Approve</div>
          </div>
        </div>
      </div>
    )
  }
  
}