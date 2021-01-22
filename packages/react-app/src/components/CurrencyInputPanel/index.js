import React, { useState, useEffect } from 'react';
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import { Contract } from "@ethersproject/contracts";
import { ethers } from "ethers";
import styled from 'styled-components';
import { ChainId, Token, WETH, Fetcher, Route } from '@uniswap/sdk'
import useWeb3Modal from "../../hooks/useWeb3Modal";

// const projectId = "66fbccb2856b40b3a622d925568379e9";
// const projectSecret = "275ed56f36e440e0ab7cad94a3310aae";



export default function CurrencyInputPanel() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [ETHAmount, setETHAmount] = useState('');
  const [SYCAmount, setSYCAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [totoken, setTotoken] = useState(true);
  const [approveAlready, setApproveAlready] = useState(false);


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
      let tx;
      setLoading(true);
      const signer = provider.getSigner()
      const implemetationContract = new Contract(addresses[RINKEBY_ID].implementation, abis.implemetation, signer);
      if (totoken) {
        tx = await implemetationContract.swapETHToSyc({ value: ethers.utils.parseEther(ETHAmount) });
      } else {
        tx = await implemetationContract.swapSycForETH(ethers.utils.parseEther(SYCAmount));
      }
      // until transactionHash is mined.
      await provider.waitForTransaction(tx.hash);
      setLoading(false);
      console.log(tx);
    } catch (err) {
      console.log(err)
    }
    setLoading(false);
  }

  async function onApprove() {
    try {
      setLoading(true);
      const signer = provider.getSigner()
      const erc20Contract = new Contract(addresses[RINKEBY_ID].tokens.SYC, abis.erc20.abi, signer);
      let tx = await erc20Contract.approve(
        addresses[RINKEBY_ID].implementation,
        ethers.utils.parseEther(SYCAmount)
      );
      await provider.waitForTransaction(tx.hash);
      setLoading(false);
      setApproveAlready(true);
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
                  <div className="ui dropdown label">
                    <div className="text">ETH</div>
                  </div>
                </div>
              </div>
              <div className="field four wide column center aligned">
                <button className="ui icon basic button" style={{ boxShadow: 'none'}} onClick={changeDirection}>
                  <i className="fas fa-exchange-alt fa-2x"></i>
                </button>
              </div>
              <div className="field six wide column">
                <label>Amount to be received (estimated)</label>
                <div className="ui right labeled input">
                  <input type="text" disabled="disabled" value={SYCAmount} />
                  <div className="ui basic label">
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
                  <div className="ui dropdown label">
                    <div className="text">SYC</div>
                  </div>
                </div>
              </div>
              <div className="field four wide column center aligned">
                <button className="ui icon basic button" style={{ boxShadow: 'none'}} onClick={changeDirection}>
                  <i className="fas fa-exchange-alt fa-2x"></i>
                </button>
              </div>
              <div className="field six wide column">
                <label>Amount to be received (estimated)</label>
                <div className="ui right labeled input">
                  <input type="text" disabled="disabled" value={ETHAmount} />
                  <div className="ui basic label">
                    ETH
                  </div>
                </div>
              </div>
            </div>
            <div className={`ui submit button right floated ${loading ? 'loading' : ''} ${approveAlready ? '': 'disabled'}`} onClick={onSwap}>Swap</div>
            <div className={`ui submit button right floated ${loading ? 'loading' : ''} ${approveAlready ? 'disabled': ''}`} onClick={onApprove}>Approve</div>
          </div>
        </div>
      </div>
    )
  }
  
}