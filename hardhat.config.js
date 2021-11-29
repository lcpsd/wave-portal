require('@nomiclabs/hardhat-waffle');
require('dotenv').config();
module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_KEY,
      accounts: [`0x${process.env.RINKEBY_PRIVATE_KEY}`],
    },
  },
  paths: {
    sources: "./src/contracts",
    tests: "./src/test",
    cache: "./src/cache",
    artifacts: "./src/artifacts"
  },
};
