const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    try {
        const [deployer] = await ethers.getSigners();
        console.log(`Deploying contract with the account : ${deployer.address}`);

        const balance = await deployer.getBalance();
        console.log(`Account balance : ${balance.toString()}`);

        const TokenContract = await ethers.getContractFactory('Token');
        const token = await TokenContract.deploy();
        console.log(`Deployed Token contract address : ${token.address}`);
        console.log(`Transaction object : ${JSON.stringify(token)}`);

        const data = {
            address : token.address,
            abi : JSON.parse(token.interface.format('json'))
        };
        fs.writeFileSync('./client/src/Token.json', JSON.stringify(data));
        
    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Script execution failed:", error);
        process.exit(1);
    });
