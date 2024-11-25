import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card'
import './Admin.scss'

import TransferFunds from '../transactions/transferFunds/TransferFunds'
import ExchangeTokens from '../transactions/exchangeTokens/ExchangeTokens'
import Panel from "../panel/Panel";

function Admin() {

    // 0: Admin, 1: Panel of stadistics, 2: Exchange EUR to SC, 3: Transfer funds, 4: Check account balances
    const [page, setPage] = useState(0)

    return(
        <div className='container'>
            <button onClick={() => 
                setPage(page === 0 ? 1 : 0)
            } className="button">
                {
                    // 0 -> Panel of control, else -> Home
                    //page === 1 ?  '📊 Panel of stadistics' : '🏡 Go home'
                    page === 0 ? '📊 Panel of stadistics' : '🏡 Go home'
                }
            </button>

            {page === 0 && (
                <div className="cards">
                    <Card 
                        title='💰 Exchange EUR to SC' 
                        descr='Exchange EUR to network&#39;s stablecoin SC'
                        onClick={() => setPage(2)}
                    />
                    <Card 
                        title='💸 Transfer funds' 
                        descr='Transfer funds from an account to another using network&#39;s stablecoin'
                        onClick={() => setPage(3)}
                        className="last-card"
                    />
                </div>
            )}

            {page === 1 && <Panel className="pageToOpen" />}
            {page === 2 && <ExchangeTokens className="pageToOpen" />}
            {page === 3 && <TransferFunds className="pageToOpen" />}
            {page === 4 && <CheckAccountBalances className="pageToOpen" />}            

        </div>
    );
}

export default Admin