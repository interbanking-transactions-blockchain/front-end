import abi from './ABI.json';
import { ethers } from 'ethers';

class BankAccounts {

    constructor() {
        this.contractAddress = "0x9a3DBCa554e9f6b9257aAa24010DA8377C57c17e";
        this.rpcEndpoint = "http://172.20.0.3:8545";
        this.provider = new ethers.JsonRpcProvider(this.rpcEndpoint);

        const contract = new ethers.Contract(this.contractAddress, abi, this.provider);
        const signerPK = "8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";
        this.signer = new ethers.Wallet(signerPK, this.provider);
        this.contract = contract.connect(this.signer);
    }

    async register(publicKey, enode, name, addresses) {
        // addNode(string memory name, string memory publicKey, string memory enode)
        console.log(`Registering bank account: ${publicKey}, ${enode}, ${name}, addresses:`)
        console.log(addresses)

        const tx = await this.contract.addNode(name, publicKey, enode);
        return tx;
    }

    login() {
        // Method to login to an existing bank account
    }
}

export default BankAccounts;