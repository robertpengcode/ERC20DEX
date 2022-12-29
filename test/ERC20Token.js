const { expect } = require("chai");

describe("ERC20Token", function () {
  let totalSupply = "1000";
  let owner;
  let user2;
  let user3;
  let erc20Token;

  before(async () => {
    [owner, user2, user3] = await ethers.getSigners();
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20Token = await ERC20Token.deploy(totalSupply);
  });

  describe("Deployment", function () {
    it("Should has correct token name", async function () {
      expect(await erc20Token.name()).to.equal("Hope Token");
    });

    it("Should let owner own all the tokens minted", async function () {
      const ownerBalance = await erc20Token.balanceOf(owner.address);
      expect(await erc20Token.balanceOf(owner.address)).to.equal(ownerBalance);
    });
  });

  describe("Transfer", function () {
    it("Should be able to transfer from owner to user2", async function () {
      await erc20Token.connect(owner).transfer(user2.address, 100);
      expect(await erc20Token.balanceOf(user2.address)).to.equal(100);
    });

    it("Should not transfer from user2 to user3", async function () {
      await expect(erc20Token.connect(user2).transfer(user3.address, 101)).to.be
        .reverted;
    });
  });
});
