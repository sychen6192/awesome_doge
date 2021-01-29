import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import styled from 'styled-components';
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";



export default function PolicyInputPanel() {
    const [loading, setLoading] = useState(false);
    const [policyName, setPolicyName] = useState(0);
    const [policyType, setpolicyType] = useState(0);
    const [policyContent, setPolicyContent] = useState(0);
    const [policyPremium, setPolicyPremium] = useState(0);
    const [policyDuration, setPolicyDuration] = useState(0);

    // after today
    const today = new Date().toISOString().split("T")[0];

    function dateToUnix(value) {
        const date = new Date(value);
        return date.getTime();
    }

    async function createPolicy() {
        try {
            let tx;
            setLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const policyFactoryContract = new Contract(addresses[RINKEBY_ID].policyFactory, abis.policyFactory, signer);
            console.log(policyFactoryContract)
            tx = await policyFactoryContract.createPolicy(
                policyName,
                policyType,
                policyContent,
                policyPremium,
                policyDuration
            );
          // until transactionHash is mined.
            await provider.waitForTransaction(tx.hash);
            setLoading(false);
            console.log(tx);
            } catch (err) {
            console.log(err)
            }
            setLoading(false);
        }

    return (
        <div className="ui container" style={{ marginTop: "20px" }}>
            <div className={`ui form ${loading ? 'loading': ''}`}>
                <div className="field">
                    <label>Policy Name</label>
                    <input type="text" placeholder="Policy Name" onChange={e => setPolicyName(e.target.value)}/>
                </div>
                <div className="field">
                    <label>Policy Type</label>
                    <select multiple="" className="ui dropdown" onChange={e => setpolicyType(e.target.value)}>
                    <option value="">Select Type</option>
                    <option value="Cyper Insurance">Cyper Insurance</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="Investment Insurance">Investment Insurance</option>
                    <option value="Auto Insurance">Auto Insurance</option>
                    </select>
                </div>
                
                <div className="field">
                    <label>Policy Content</label>
                    <input type="text" placeholder="Policy Content" onChange={e => setPolicyContent(e.target.value)}/>
                </div>
                <div className="field">
                    <label>Policy Premium</label>
                    <input type="number" placeholder="Policy Premium" onChange={e => setPolicyPremium(e.target.value)}/>
                </div>
                <div className="field">
                    <label>Policy Duration</label>
                    <input type="date" placeholder="Policy Duration" min={today} onChange={e => setPolicyDuration(dateToUnix(e.target.value))}/>
                </div>
                <button 
                    className="ui button right floated"
                    onClick={createPolicy}>Create</button>
            </div>
        </div>
    )
}