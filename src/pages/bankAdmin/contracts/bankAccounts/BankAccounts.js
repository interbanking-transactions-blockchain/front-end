import abi from './ABI.json';
import { ethers } from 'ethers';
import secp256k1 from '@wangshijun/secp256k1';

//import * as secp256k1 from '@noble/secp256k1';

class BankAccounts {

    constructor() {
        this.contractAddress = "0xfeae27388A65eE984F452f86efFEd42AaBD438FD";
        this.rpcEndpoint = "http://172.20.0.3:8545";
        this.provider = new ethers.JsonRpcProvider(this.rpcEndpoint);
        this.contract = new ethers.Contract(this.contractAddress, abi, this.provider);
        this.signed = false;
    }

    getNodePublicKey(nodePrivateKey32) {
        // Method to get the public key from the private key
        // This is used to identify the bank account

        // Remove 0x prefix if present
        const privKey = nodePrivateKey32.replace('0x', '');

        const privateKeyUint8Array = new Uint8Array(
            privKey.match(/.{1,2}/g)
            .map(byte => parseInt(byte, 16))
        );
        
        const publicKeyBytes = secp256k1.publicKeyCreate(privateKeyUint8Array, false); // False to generate the 64 bytes key

        const publicKey = Array.from(publicKeyBytes)
            .slice(1) // Remove '04' prefix
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return publicKey;
    }

    signContract(accountPrivateKey32) {
        // Method to sign the contract with the bank account's private key
        // This is used to make transactions on behalf of the bank account
        if (this.signed) {
            return;
        }
        this.signer = new ethers.Wallet(accountPrivateKey32, this.provider);
        this.contract = this.contract.connect(this.signer);
        this.signed = true;
    }
    
    async nodeExists(publicKey) {
        // Method to check if a bank account already exists
        // nodeExists(string memory publicKey) public view returns (bool)
        const exists = await this.contract.nodeExists(publicKey);
        return exists;
    }

    async accountExists(accountPrivateKey32) {
        // Method to check if a bank account already exists
        // accountExists(string memory accountPrivateKey) public view returns (bool)
        const exists = await this.contract.accountExists(accountPrivateKey32);
        return exists
    }

    async register(publicKey, enode, name, accountPrivateKey32) {
        // addNode(string memory name, string memory publicKey, string memory enode)

        // Sign the contract with the bank account's private key
        console.log("Registering bank node, signing contract");
        this.signContract(accountPrivateKey32);
        console.log("Contract signed");

        console.log(`Registering bank: ${publicKey}, ${enode}, ${name}`)

        const tx = await this.contract.addNode(name, publicKey, enode);
        return tx;
    }

    async login(publicKey64, bankName) {
        // Method to login to an existing bank account
        // nodeExistsByName(string memory publicKey, string memory name)

        console.log(`Logging in to bank account: ${publicKey64}, ${bankName}`)
        const exists = await this.contract.nodeExistsByName(publicKey64, bankName);
        console.log(`Bank account exists: ${exists}`)
        return exists;
    }

    async addAccount(publicKey64, address, gasMultiplier) {
        // Method to add an account to the bank node
        // addAccount(string memory publicKey, address account)

        // No need to sign as the contract is already signed on register call or login

        try {
            const addressFormatted = ethers.getAddress(address);
            
            // Get current gas price and increase it by 20%
            const feeData = await this.provider.getFeeData();
            const originalGasPrice = BigInt(feeData.gasPrice.toString());
            const gasToAdd = 20 * gasMultiplier;
            const gasPriceIncreased = (originalGasPrice * BigInt(100 + gasToAdd)) / BigInt(100);
            console.log(`Adding account: ${address} | Original gas price: ${originalGasPrice} | Increased gas price: ${gasPriceIncreased}`);

            // Estimate gas for the transaction
            const gasEstimate = await this.contract.addAccount.estimateGas(
                publicKey64, 
                addressFormatted
            );

            // Send transaction with explicit gas configuration
            const tx = await this.contract.addAccount(
                publicKey64, 
                addressFormatted,
                {
                    gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
                    gasPrice: gasPriceIncreased
                }
            );
            
            // Wait for transaction confirmation
            await tx.wait();
            console.log(`Account added: ${address}`);
            return tx;
        } catch (error) {
            // If error is not related to gas then stop trying
            const gasErrorMessage = "replacement fee too low";
            if (!error.message.includes(gasErrorMessage)) {
                console.error(`Failed to add account: ${address}`, error);
                return;
            }

            console.log(`Trying again adding account ${address} with a higher gas multiplier (${20 * (gasMultiplier + 4)}%)`);

            // If gas multipier is too high then stop trying
            if (gasMultiplier > 100) {
                console.error(`No more retries for account: ${address} as gas multiplier is too high (${20 * gasMultiplier}%)`);
                console.error(`Failed to add account: ${address}`, error);
                return;
            }

            // Try again with a higher gas multiplier
            return this.addAccount(publicKey64, address, gasMultiplier + 4);
        }
    }
}

export default BankAccounts;