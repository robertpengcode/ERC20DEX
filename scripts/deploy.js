const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");
  const erc20Token = await ERC20Token.deploy("1000");
  const Dex = await hre.ethers.getContractFactory("Dex");
  const dex = await Dex.deploy(erc20Token.address, 5);
  await erc20Token.deployed();
  await dex.deployed();
  await writeDeploymentInfo(erc20Token, "erc20Token.json");
  await writeDeploymentInfo(dex, "dex.json");
}

async function writeDeploymentInfo(contract, filename) {
  const data = {
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
