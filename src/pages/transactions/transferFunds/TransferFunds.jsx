import React from "react"
import { useState } from "react"
import { ethers } from "ethers"
import './TransferFunds.scss'
import stableCoinAbi from "../../../abiFiles/StableCoinABI.json"

function TransferFunds(){

    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    const contractAddress = "0xa50a51c09a5c451C52BB714527E1974b686D8e77";

    const [fromAccount, setFromAccount] = useState("");
    const [toAccount, setToAccount] = useState("");
    const [privateKeyFromAccount, setPrivateKeyFromAccount] = useState("")
    const [amount, setAmount] = useState("");

    const handleTransfer = async () => {
        try{
            const wallet = new ethers.Wallet(privateKeyFromAccount, provider);
        
            const approved = await approveTokens(fromAccount, amount);
            if (!approved) return;
    
            const smartContract = new ethers.Contract(contractAddress, stableCoinAbi, wallet);
    
            const tx = await smartContract.transferFrom(
                fromAccount,
                toAccount,
                ethers.utils.parseUnits(amount, 18) // Ajusta a los decimales del token
            );
            console.log("Transacción enviada para transferFrom:", tx.hash);
            await tx.wait(); // Esperar confirmación
            alert("Transferencia completada con éxito!");
        } catch (error) {
            console.error("Error durante la transferencia: ", error);
            alert("Ocurrio un error. Revisa la consola.")
        }
    };

    return(
        <div className="exchange-container">
            <h2 className="title">Transfer funds</h2>
            <div className="token-checker">
                <div className="token-checker-section">
                    <h2>Transfer SC to another account</h2>
                    <label>Account to deposit tokens</label>
                    <input
                        type="text"
                        value={toAccount}
                        onChange={(e) => setToAccount(e.target.value)}
                        placeholder="Enter recipient account"
                    />
                    <label>Account where the tokens would be debited</label>
                    <input
                        type="text"
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                        placeholder="Enter sender account"
                    />
                    <label>Put the private key of the sender account</label>
                    <input
                        type="text"
                        value={privateKeyFromAccount}
                        onChange={(e) => setPrivateKeyFromAccount(e.target.value)}
                        placeholder="Enter private key of the sender account"
                    />
                    <label>Number of tokens to exchange</label>
                    <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter number of SC you want to exchange"
                    />
                    <button onClick={handleTransfer} className="token-checker-button">
                        Transfer
                    </button>
                </div>
            </div>
        </div>
    );
}

async function approveTokens(spender, amount) {
    try {
        const wallet = new ethers.Wallet(privateKeyFromAccount, provider);
        const smartContract = new ethers.Contract(contractAddress, erc20Abi, wallet);

        console.log("Aprobando tokens...");
        const tx = await smartContract.approve(
            spender, 
            ethers.utils.parseUnits(amount, 18) // Ajusta a los decimales del token
        );

        console.log("Transacción enviada para approve:", tx.hash);
        await tx.wait(); // Esperar confirmación
        console.log("Tokens aprobados exitosamente");
        return true;
    } catch (error) {
        console.error("Error al aprobar tokens:", error);
        alert("Error durante la aprobación. Revisa la consola.");
        return false;
    }
}


export default TransferFunds