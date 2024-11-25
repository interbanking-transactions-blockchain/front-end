import React, { useState } from "react"
import BankAccounts from "../../contracts/bankAccounts/BankAccounts"
import StableCoin from "../../contracts/stableCoin/stableCoin"
import "./Home.scss"

import Admin from "../admin/Admin"

function BankAdmin() {

    const bankAccounts = new BankAccounts()
    const stableCoin = new StableCoin()

    // 1: Not logged in, 2: Logged in, 3: Registering
    const [loginStatus, setLoginStatus] = useState(1)

    // Register form fields
    const [publicKey, setPublicKey] = useState("")
    const [enode, setEnode] = useState("")
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [totalReserves, setTotalReserves] = useState("")

    // Login form fields
    const [loginKey, setLoginKey] = useState("") // Private key for login
    const [bankName, setBankName] = useState("") // Bank name

    // Register function
    const register = async () => {
        // Check for empty fields
        if (publicKey === "" || enode === "" || name === "" || address === "" || totalReserves === "") {
            console.error("Empty fields")
            alert("Please fill all fields")
            return
        }
        // First, check existance
        const exists = await bankAccounts.nodeExists(publicKey)
        if (exists) {
            console.error("Bank account already exists")
            alert("Bank node already exists. Try again with a different node public key or login.")
            return
        }

        // Second, check that account existance
        const accountExists = await bankAccounts.accountExists(address)
        if (accountExists) {
            console.error("Bank account already exists on other bank")
            alert("Bank account already exists on another bank. Try again with a different account address.")
            return
        }

        // Register bank account
        const tx = await bankAccounts.register(publicKey, enode, name, address, totalReserves)
        await tx.wait()
        console.log(`Transaction successful: ${tx.hash}`)

        // Mint reserves to the bank account
        const mintTx = await stableCoin.mintBank(address, totalReserves)
        await mintTx.wait()
        console.log(`Mint transaction successful: ${mintTx.hash}`)

        // Set login status to logged in
        setLoginStatus(2)
    }

    // Login function
    const login = async () => {
        // Get the node public key from the private key
        const publicKey64 = bankAccounts.getNodePublicKey(loginKey)
        console.log(`Public key: ${publicKey64}`)

        // Attempt to login
        try {
            const exists = await bankAccounts.login(publicKey64, bankName)
            if (exists) {
                console.log("Login successful")
                setLoginStatus(2)
                // Sign the contract with the bank account's private key
                bankAccounts.signContract(loginKey)
            } else {
                console.error("Login failed")
                alert("Login failed. Check your bank name and private key.")
            }
        } catch (error) {
            console.error(`Error logging in: ${error.message}`)
        }
    }

    const testingValues = () => {
        setPublicKey("0x69e84b9c135d789b637ba454fdcf7c348b3fcee0713e248c1e3edcc652088563ae5a4fd0698f7f796b875bd8008c9197022e7c15c3680e8b7cb7ec68f8b33dfa")
        setEnode("enode://69e84b9c135d789b637ba454fdcf7c348b3fcee0713e248c1e3edcc652088563ae5a4fd0698f7f796b875bd8008c9197022e7c15c3680e8b7cb7ec68f8b33dfa@172.20.0.3:30303")
        setName("Hello Bank")
        setAddress("627306090abaB3A6e1400e9345bC60c78a8BEf57")
        setBankName("Hello Bank")
        setLoginKey("0xaeba9c972504a76e1953667411f54c801da24a0896a7e305aebee241b1b45243")
        setTotalReserves("1000000")
    }

    return (
        <div className="admin">

            <div className="header">
                <h1>Private besu network for cross-border payment</h1>
            </div>

            <div className="body">

                {loginStatus === 1 && (
                    <div className="login">
                        <div className="login-name">Enter your bank name</div>
                        <br />
                        <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="text-input-short"
                        />
                        <br />

                        <div className="login-key">Enter your bank node private key (32 bytes)</div>
                        <br />
                        <input
                            type="text"
                            value={loginKey}
                            onChange={(e) => setLoginKey(e.target.value)}
                            className="text-input-short"
                        />
                        <br />

                        <button onClick={() => login()} className="button">
                            Login
                        </button>
                        <br />

                        <div className="text-button last-tag" onClick={() => setLoginStatus(3)}>
                            Register
                        </div>

                        <div className="text-button" onClick={() => testingValues()}>
                            Use testing values
                        </div>
                    </div>
                )}
                {loginStatus === 2 && (
                    <div className="logged-in">
                        <Admin />
                    </div>
                )}
                {loginStatus === 3 && (

                    <div className="register">

                        <div className="enter-key">Enter your bank node public key (64 bytes)</div>
                        <br />
                        <input
                            type="text"
                            value={publicKey}
                            onChange={(e) => setPublicKey(e.target.value)}
                            className="text-input-short"
                        />
                        <br />
                        <div className="bank-name">Enter your bank name</div>
                        <br />
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="text-input-short"
                        />

                        <br />
                        <div className="bank-enode">Enter your bank enode URL</div>
                        <br />
                        <input
                            type="text"
                            value={enode}
                            onChange={(e) => setEnode(e.target.value)}
                            className="text-input-short"
                        />

                        <br />
                        <div className="bank-addresses">Enter your bank account public address</div>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="text-input-short"
                        />

                        <br />
                        <div className="bank-addresses">Enter your bank total reserves in EUR FIAT</div>
                        <input
                            type="text"
                            value={totalReserves}
                            onChange={(e) => setTotalReserves(e.target.value)}
                            className="text-input-short"
                        />

                        <br />
                        <button onClick={() => register()} className="button register-button">
                            Register
                        </button>
                        <br />

                        <div className="text-button" onClick={() => testingValues()}>
                            Use testing values
                        </div>

                        <div className="text-button last-tag" onClick={() => setLoginStatus(1)}>
                            Back
                        </div>
                    </div>

                )}
            </div>

        </div>
    );

}

export default BankAdmin