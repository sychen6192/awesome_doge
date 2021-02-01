import React, { useState, useEffect } from "react";
import Jumbotron from '../Jumbotron';
import styled from 'styled-components';
import { ethers } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { RINKEBY_ID, addresses, abis } from "@uniswap-v2-app/contracts";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


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
                <Grid key={idx} item>
                    <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    {element[0]}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    Insurance Type: <span style={{float: 'right'}}>{element[1]}</span>
                  </Typography>
                  <Typography color="textSecondary">
                    Stacked: <span style={{float: 'right'}}>{element[6].toString()} SYC</span>
                  </Typography>

                </CardContent>
                <CardActions>
                    <Button component={ Link } to={`/staking/${idx}`} variant="contained" color="primary">
                        Stack
                    </Button>
                </CardActions>
              </Card>
                </Grid>
            
            );
        })

    }


    return (
        <div>
            <Jumbotron
                title="Stake"
                description="Earn rewards by staking SYC on policies you want to engage." />
            <Container style={{ marginTop: "20px" }}>
                <Grid container style={{ marginTop: "20px" }} spacing={5}>
                    {renderList(policies)}
                </Grid>
            </Container>

        </div>
    );
}