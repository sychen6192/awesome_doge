import React, { useState, useEffect } from "react";
import Jumbotron from '../Jumbotron';
import styled from 'styled-components';
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import { Link } from 'react-router-dom';



export default function StakeItem(props) {
    const [policies, setPolicies] = useState(0);
    const [minPremium, setminPremium] = useState(0);
    const [totalDeposit, settotalDeposit] = useState('');
    const [topupValue, setTopupValue] = useState('');
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const getPolicies = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const account = await signer.getAddress()

            const policyFactoryContract = new Contract(addresses[RINKEBY_ID].policyFactory, abis.policyFactory, provider)
            const policiesAddress = await policyFactoryContract.deployedPolicies(props.match.params.id)
            const policy = new Contract(policiesAddress, abis.policy, provider)
            const policyInfo = await policy.getSummary()
            const stackOf = await policy.stackOf(account)

            setminPremium(policyInfo[3])
            setPolicies(policyInfo)
            settotalDeposit(stackOf.toString())
        }

        getPolicies();
    }, []);


  

    async function onStake() {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const policyFactoryContract = new Contract(addresses[RINKEBY_ID].policyFactory, abis.policyFactory, signer);
        const policyAddress = await policyFactoryContract.deployedPolicies(props.match.params.id);
        const policy = new Contract(policyAddress, abis.policy, signer);

        // approve
        const erc20Contract = new Contract(addresses[RINKEBY_ID].tokens.SYC, abis.erc20.abi, signer);
        let tx = await erc20Contract.approve(
        policyAddress,
        ethers.utils.parseEther(topupValue)
        );
        await provider.waitForTransaction(tx.hash);
        
        tx = await policy.createStake(topupValue);

        await provider.waitForTransaction(tx.hash);

        setLoading(false);
        // emit event
    }

    function total() {
        if (totalDeposit && topupValue) return parseInt(totalDeposit)+parseInt(topupValue)
    }



    return (
        <div>
            <Jumbotron
                title="Deposit"
                description="Stake SYC on your selected project." />
            <div className={`ui big form ${loading ? 'loading': ''}`} style={{ marginTop: '20px'}}>
                <div className="two fields">
                    <div className="field">
                        <label>Top Up</label>
                        <div className="ui right labeled input">
                            <input type="number" onChange={e => setTopupValue(e.target.value)} value={topupValue} />
                            <div className="ui basic label">
                                SYC
                            </div> 
                        </div>
                    </div>
                    <div className="field">
                        <label>Your position</label>
                        <div className="ui right labeled input">
                            <input type="number" disabled="disabled" value={total()} />
                            <div className="ui basic label">
                                SYC
                            </div>   
                        </div> 
                    </div>
                </div>
                <div className="ui submit button right floated" onClick={onStake}>Stake</div>
                </div>
            </div>
    );
}