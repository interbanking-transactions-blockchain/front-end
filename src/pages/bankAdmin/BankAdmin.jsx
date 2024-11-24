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
    const [accountPrivateKey32, setAccountPrivateKey32] = useState("")

    // Login form fields
    const [loginKey, setLoginKey] = useState("") // Private key for login
    const [bankName, setBankName] = useState("") // Bank name

    // Function to remove the 0x prefix from all key fields
    const remove0x = () => {
        setPublicKey(publicKey.replace("0x", ""))
        setAccountPrivateKey32(accountPrivateKey32.replace("0x", ""))
        setLoginKey(loginKey.replace("0x", ""))

        // Remove 0x from all addresses
        const addrs = addresses.split(",")
        let newAddrs = ""
        addrs.forEach((addr) => {
            newAddrs += addr.replace("0x", "") + ","
        })
        setAddresses(newAddrs)
    }

    // Register function
    const register = async () => {
        try {
            remove0x()
            // Check for empty fields
            if (publicKey === "" || enode === "" || name === "" || accountPrivateKey32 === "") {
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
            const accountExists = await bankAccounts.nodeExists(accountPrivateKey32)
            if (accountExists) {
                console.error("Bank account already exists")
                alert("Bank account already exists. Try again with a different account private key or login.")
                return
            }

            // Register bank account
            const tx = await bankAccounts.register(publicKey, enode, name, accountPrivateKey32)
            console.log(`Transaction successful: ${tx.hash}`)
            setLoginStatus(2)
            
            // Add addresses in the background
            const addrs = addresses.split(",")
            console.log(`Adding addresses:`)
            console.log(addrs)
            addrs.forEach(async (addr) => {
                const tx = await bankAccounts.addAccount(publicKey, addr)
                console.log(`Adding address | transaction successful: ${tx.hash}`)
            })
        } catch (error) {
            console.error(`Error registering bank account: ${error.message}`)
        }
    }

    // Login function
    const login = async () => {
        remove0x()
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
        setAddresses("fe3b557e8fb62b89f4916b721be55ceb828dbd73,627306090abaB3A6e1400e9345bC60c78a8BEf57,f17f52151EbEF6C7334FAD080c5704D77216b732")
        setAccountPrivateKey32("8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63")
        setBankName("Hello Bank")
        setLoginKey("0xaeba9c972504a76e1953667411f54c801da24a0896a7e305aebee241b1b45243")
    }

    return (
        <div className="admin">

            <div className="header">
                <h1>Interbanking blockchain demo</h1>
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
                        <h4>Welcome, you are logged in! Your public key is {publicKey}</h4>
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

                        <div className="bank-account-private-key">Enter your an account private key from your bank (32 bytes)</div>
                        <br />
                        <input
                            type="text"
                            value={accountPrivateKey32}
                            onChange={(e) => setAccountPrivateKey32(e.target.value)}
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