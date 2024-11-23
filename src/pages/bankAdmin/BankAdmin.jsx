import React, { useState } from "react"
import BankAccounts from "./contracts/bankAccounts/BankAccounts"
import "./BankAdmin.scss"

function BankAdmin() {

    const bankAccounts = new BankAccounts()

    // 1: Not logged in, 2: Logged in, 3: Registering
    const [loginStatus, setLoginStatus] = useState(1)

    // Register form fields
    const [publicKey, setPublicKey] = useState("")
    const [enode, setEnode] = useState("")
    const [name, setName] = useState("")
    const [addresses, setAddresses] = useState("")

    // Login form fields
    const [loginKey, setLoginKey] = useState("") // Private key for login

    // Login function
    const login = async () => {
        setLoginStatus(2)
    }

    // Register function
    const register = async () => {
        try {
            const tx = await bankAccounts.register(publicKey, enode, name, addresses.split(","))
            console.log(`Transaction successful: ${tx.hash}`)
            setLoginStatus(2)
        } catch (error) {
            console.error(`Error registering bank account: ${error.message}`)
        }
    }

    const testingValues = () => {
        setPublicKey("0x69e84b9c135d789b637ba454fdcf7c348b3fcee0713e248c1e3edcc652088563ae5a4fd0698f7f796b875bd8008c9197022e7c15c3680e8b7cb7ec68f8b33dfa")
        setEnode("enode://69e84b9c135d789b637ba454fdcf7c348b3fcee0713e248c1e3edcc652088563ae5a4fd0698f7f796b875bd8008c9197022e7c15c3680e8b7cb7ec68f8b33dfa@172.20.0.3:30303")
        setName("Hello Bank")
        setAddresses("fe3b557e8fb62b89f4916b721be55ceb828dbd73,627306090abaB3A6e1400e9345bC60c78a8BEf57,f17f52151EbEF6C7334FAD080c5704D77216b732")
    }

    return (
        <div className="admin">

            <div className="header">
                <h1>Interbanking blockchain demo</h1>
            </div>

            <div className="body">

                {loginStatus === 1 && (
                    <div className="login">
                        <div className="enter-key">Enter your bank node private key (0xabc 32 bytes)</div>
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
                    </div>
                )}
                {loginStatus === 2 && (
                    <div className="logged-in">
                        <h4>Welcome, you are logged in! Your public key is {publicKey}</h4>
                    </div>
                )}
                {loginStatus === 3 && (

                    <div className="register">

                        <div className="enter-key">Enter your bank node public key (0xabc 64 bytes)</div>
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

                        <div className="bank-enode">Enter your bank enode URL</div>
                        <br />
                        <input
                            type="text"
                            value={enode}
                            onChange={(e) => setEnode(e.target.value)}
                            className="text-input-short"
                        />

                        <br />

                        <div className="bank-addresses">Enter your bank account public addresses separeted by "," (optional)</div>

                        <textarea
                            value={addresses}
                            onChange={(e) => setAddresses(e.target.value)}
                            className="text-input-long"
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