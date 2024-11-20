import React, { useState } from "react"
import { ethers } from "ethers"
import stableCoinAbi from "../../abiFiles/StableCoinABI.json"
import "./ExchangeTokens.css"

function ExchangeTokens(){

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const contractAddress = "0xa50a51c09a5c451C52BB714527E1974b686D8e77"; 

    const [checkAccount, setCheckAccount] = useState("");
    const [token, setToken] = useState("");

    const [recipientAccount, setRecipientAccount] = useState("");
    const [tokensToExchange, setTokensToExchange] = useState("");

    const handleCheck = async () => {
        const smartContract = new ethers.Contract(contractAddress, stableCoinAbi, provider);
        const balance = await smartContract.balanceOf(checkAccount);
        const formattedBalance = ethers.formatUnits(balance, 18);
        setToken(String(formattedBalance))
    }

    const handleExchange = () => {
        setToken("# de tokens")
    }

    return(
        <div>
            <h1>Exchange tokens</h1>
            <div className="token-checker">
                <div className="token-checker-section">
                    <h2>Check account balance</h2>
                    <label>Enter an account to check their SC balance</label>
                    <input
                        type="text"
                        value={checkAccount}
                        onChange={(e) => setCheckAccount(e.target.value)}
                        placeholder="Enter the account"
                    />
                    <button onClick={handleCheck} className="token-checker-button">
                        Check
                    </button>

                    <table className="token-checker-table">
                    <thead>
                        <tr>
                        <th>Tokens</th>
                        <th>Currency</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>{token}</td>
                        <td>SC</td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <div className="token-checker-section">
                    <h2>Exchange tokens</h2>
                    <label>Account to deposit tokens</label>
                    <input
                        type="text"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        placeholder="Enter recipient account"
                    />
                    <label>Number of tokens to exchange</label>
                    <input
                    type="number"
                    value={tokensToExchange}
                    onChange={(e) => setTokensToExchange(e.target.value)}
                    placeholder="Enter number of euros you want to exchange"
                    />
                    <button onClick={handleExchange} className="token-checker-button">
                        Exchange
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ExchangeTokens