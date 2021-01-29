import React, { useState, useEffect } from "react";
import Jumbotron from '../Jumbotron';
import styled from 'styled-components';
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import { Link } from 'react-router-dom';


export default function StakePage() {
    const [policies, setPolicies] = useState(0);

    useEffect(() => {
        const getPolicies = async () => {
            let policy, summary;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const policyFactoryContract = new Contract(addresses[RINKEBY_ID].policyFactory, abis.policyFactory, provider);
            const policies = await policyFactoryContract.getDeloyedPolicies();

            const allPolicies = await Promise.all(
                policies
                    .map((address, index) => {
                        policy = new Contract(address, abis.policy, provider);
                        return policy.getSummary();
                    }));

            setPolicies(allPolicies);
        }
        getPolicies();
    }, []);

    function renderList(policies) {
        if (policies == 0) {
            return <div>Loading...</div>
        }
        return Object.values(policies).map((element, idx) => {
            return (
                <div className="column" key={idx} >
                        <div className="ui segment" style={{borderRadius: '15px'}} >
                            <h4>{element[0]}</h4>
                            <p>Insurance Type: <span style={{float: 'right'}}>{element[1]}</span></p>
                            <p>Stacked: <span style={{float: 'right'}}>{element[6].toString()} SYC</span></p>
                            <p>Insurance Content: <span style={{float: 'right'}}>{element[2]}</span></p>
                            <Link className="positive ui fluid button" to={`/staking/${idx}`}>Stake</Link>
                        </div>
                </div>
            );
        })

    }

    // async function onStake(idx) {
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.signer();
    //     const policyFactoryContract = new Contract(addresses[RINKEBY_ID].policyFactory, abis.policyFactory, provider);
    //     const policyAddress = await policyFactoryContract.deployedPolicies(idx);
    //     const policy = new Contract(policyAddress, abis.policy, signer);
    //     await policy.createStake()

    // }


    return (
        <div>
            <Jumbotron
                title="Stake"
                description="Earn rewards by staking SYC on policies you want to engage." />
            <div className="ui three column grid" style={{ marginTop: "20px" }}>
                {renderList(policies)}
            </div>
        </div>
    );
}