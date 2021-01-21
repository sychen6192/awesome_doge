import styled from "styled-components";
import React from 'react';
import { ReactComponent as LogoIcon } from '../assets/logo.svg'


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

const HeaderContainer = styled.header`
  background-color: #282c34;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  color: white;
`;

const HeaderLogo = styled.a`
  color: #FFFFFF;
  text-decoration: none;
  display: flex;
  align-items: center;
  > *:not(:first-child) {
    margin-left: 4px;
  }
`

const LogoTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
`

const LogoSubTitle = styled.div`
  font-size: 12px;
  font-weight: 300;
  letter-spacing: '1.7px'};
`


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
        <HeaderContainer>
            <HeaderLogo href='/'>
                <LogoIcon />
                <div>
                    <LogoTitle>xxxx</LogoTitle>
                    <LogoSubTitle>
                        xxx
                    </LogoSubTitle>
                </div>
            </HeaderLogo>
            <WalletButton provider={props.provider} loadWeb3Modal={props.loadWeb3Modal} logoutOfWeb3Modal={props.logoutOfWeb3Modal} />
        </HeaderContainer>
    );
}
