import React from "react";
import { Router, Route, Switch } from 'react-router-dom';
// import { Router, Route, Link, hashHistory } from 'react-router'
import history from './history';
import Header from './components/Header';
import SwapPage from './components/Pages/SwapPage';
import PolicyPage from './components/Pages/PolicyPage';
import StakePage from './components/Pages/StakePage';
import StakeItem from './components/Pages/StakeItem';
import useWeb3Modal from "./hooks/useWeb3Modal";


function App() {
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();

  return (
    <div className="ui container">
      <Header provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal}/>
      <Router history={history}>
          <Switch>
            <Route path="/" exact component={SwapPage} />
            <Route path="/policy/new" exact component={PolicyPage} />
            <Route path="/staking" exact component={StakePage} />
            <Route path="/staking/:id" exact component={StakeItem} />
          </Switch>
      </Router>
    </div>
  );
}

export default App;
