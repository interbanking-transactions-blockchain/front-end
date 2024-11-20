import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card'
import './Home.css'


function Home() {

    const navigate = useNavigate();

    return(
    <div>
        <h1>Private besu network for cross-border payment</h1>
        <div className='container'>
            <Card 
                title='💰 Exchange EUR to SC' 
                descr='Exchange EUR to network&#39;s stablecoin SC'
                onClick={() => navigate('/exchangeTokens')}
            />
            <Card 
                title='💸 Transfer funds' 
                descr='Transfer funds from an account to another using network&#39;s stablecoin'
                onClick={() => navigate('/transferFunds')}
            />
            <Card 
                title='🧾 Check account balances' 
                descr='Check the network accounts balances'
                onClick={() => navigate('/checkAccountBalances')}
            />
        </div>
      </div>
    );
}

export default Home