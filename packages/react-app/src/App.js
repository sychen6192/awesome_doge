import React from "react";
import { BrowserRouter, Router, Route, Switch } from 'react-router-dom';
// import { Router, Route, Link, hashHistory } from 'react-router'
import history from './history';
import { useQuery } from "@apollo/react-hooks";
import Header from './components/Header';
import SwapPage from './components/Pages/SwapPage';
import PolicyPage from './components/Pages/PolicyPage';
import useWeb3Modal from "./hooks/useWeb3Modal";


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div className="ui container">
      <Header provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>
      <BrowserRouter>
          <Switch>
            <Route path="/" exact component={SwapPage} />
            <Route path="/policy/new" exact component={PolicyPage} />
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
