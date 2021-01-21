import React from "react";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import { useQuery } from "@apollo/react-hooks";

// import { Body, Button, Header, Image, Link } from "./components";
import Header from './components/Header';
import logo from "./ethereumLogo.png";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { MAINNET_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import GET_AGGREGATED_UNISWAP_DATA from "./graphql/subgraph";



function App() {
  const { loading, error, data } = useQuery(GET_AGGREGATED_UNISWAP_DATA);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  React.useEffect(() => {
    if (!loading && !error && data && data.uniswapFactories) {
      console.log({ uniswapFactories: data.uniswapFactories });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header />
    </div>
  );
}

export default App;
