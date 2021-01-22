import React from "react";
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import { useQuery } from "@apollo/react-hooks";

// import { Body, Button, Header, Image, Link } from "./components";
import Header from './components/Header';
import Jumbotron from './components/Jumbotron';
import CurrencyInputPanel from './components/CurrencyInputPanel'
import useWeb3Modal from "./hooks/useWeb3Modal";
import swapPage from './components/Pages/swapPage';

// import { MAINNET_ID, addresses, abis } from "@uniswap-v2-app/contracts";
// import GET_AGGREGATED_UNISWAP_DATA from "./graphql/subgraph";


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div className="ui container">
      <Router history={history}>
        <div>
          <Header provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
          <Switch>
            <Route path="/" exact component={swapPage} provider={provider} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
