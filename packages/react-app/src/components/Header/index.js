import styled from "styled-components";
import React from 'react';

const Button = styled.button`
  background-color: white;
  border: none;
  border-radius: 8px;
  color: #282c34;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
  margin: 0px 20px;
  padding: 12px 24px;

  ${props => props.hidden && "hidden"} :focus {
    border: none;
    outline: none;
  }
`;

const HeaderStyled = styled.header`
  background-color: #282c34;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;


function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {
    return (
        <Button
            onClick={() => {
                if (!provider) {
                    loadWeb3Modal();
                } else {
                    logoutOfWeb3Modal();
                }
            }}
        >
            {!provider ? "Connect Wallet" : "Disconnect Wallet"}
        </Button>
    );
}

export default function Header(props) {
    return (
        <HeaderStyled>
            <WalletButton provider={props.provider} loadWeb3Modal={props.loadWeb3Modal} logoutOfWeb3Modal={props.logoutOfWeb3Modal} />
        </HeaderStyled>
    ); 
}
