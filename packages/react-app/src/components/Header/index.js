// import styled from "styled-components";
import React, { useEffect, useState } from 'react';
// import { ReactComponent as LogoIcon } from '../../assets/logo.svg'


function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
            <div className="ui button"
                onClick={() => {
                    if (!provider) {
                        loadWeb3Modal();
                    } else {
                        logoutOfWeb3Modal();
                    }
                }}
            >
                {!provider ? "Connect Wallet" : "Disconnect Wallet"}
            </div>

    );
}

export default function Header({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    const [network, setNetwork] = useState('No network detected');
    useEffect(() => {
        const getNetwork = async () => {
            if (provider) {
                console.log(provider)
                const network = await provider.getNetwork()
                setNetwork(network.name)
            }
        }
        getNetwork();
    }, [provider])

    return (
        <div className="ui secondary pointing menu">
            <a className="item" href="/">
                Swap
            </a>
            <a className="item" href="/">
                Funding Pool
            </a>
            <div className="right menu">
                <div className="item">
                    <div className="ui button">
                        {network}
                    </div>
                </div>
                <div className="item">
                    <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
                </div>
            </div>
        </div>

    );
}
