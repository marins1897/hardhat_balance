/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-waffle');
require("dotenv").config();

const INFURA_URL = process.env.API_KEY;
const MNEMONIC = process.env.MNEMONIC;
// const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  networks: {
    goerli: {
      url: INFURA_URL,
      accounts: {
        mnemonic: MNEMONIC,
        // [`0x${PRIVATE_KEY}`]
      },
    },
  },
  solidity: {
    version: "0.8.0", 
  },
};
