const { expect } = require("chai");

describe("Dex", function () {
  let totalSupply = "1000";
  let owner;
  let user2;
  let erc20Token;
  let dex;
  let price = 5;

  before(async () => {
    [owner, user2] = await ethers.getSigners();
    const ERC20Token = await ethers.getContractFactory("ERC20Token");
    erc20Token = await ERC20Token.deploy(totalSupply);
    const Dex = await ethers.getContractFactory("Dex");
    dex = await Dex.deploy(erc20Token.address, price);
  });

  describe("Getter functions", function () {
    it("Should get correct token balance", async function () {
      expect(await dex.getTokenBalance()).to.equal(0);
    });

    it("Should get correct transaction value", async function () {
      expect(await dex.getTransactionValue(10)).to.equal(10 * price);
    });
  });

  describe("Owner transfer tokens to Dex for sale", function () {
    it("Should not transfer without allowance", async function () {
      await expect(dex.transferToDexForSale()).to.be.reverted;
    });

    it("Should be able to approve", async function () {
      await erc20Token.approve(dex.address, 200);
      expect(await erc20Token.allowance(owner.address, dex.address)).to.equal(
        200
      );
    });

    it("Should not allow non-owner to call this function", async function () {
      await expect(dex.connect(user2).transferToDexForSale()).to.be.reverted;
    });

    it("Should allow owner to transfer to Dex", async function () {
      expect(await dex.transferToDexForSale()).to.changeTokenBalances(
        erc20Token,
        [owner.address, dex.address],
        [-200, 200]
      );
    });
  });

  describe("Buy tokens", function () {
    it("Should not allow users to buy tokens with wrong value sent", async function () {
      await expect(dex.connect(user2).buyToken(100, { value: 550 })).to.be
        .reverted;
    });

    it("Should allow users to buy tokens", async function () {
      const check = await erc20Token.balanceOf(owner.address);
      console.log(check);
      expect(
        await dex.connect(user2).buyToken(100, { value: 500 })
      ).to.changeTokenBalances(
        erc20Token,
        [user2.address, dex.address],
        [100, -100]
      );
    });

    it("Should not allow users to buy tokens than Dex has", async function () {
      await expect(dex.connect(user2).buyToken(101, { value: 505 })).to.be
        .reverted;
    });
  });

  describe("Owner withdraw tokens", function () {
    it("Should not allow non-owner to call this function", async function () {
      await expect(dex.connect(user2).withDrawTokens()).to.be.reverted;
    });

    it("Should allow owner withdraw tokens", async function () {
      expect(await dex.withDrawTokens()).to.changeTokenBalances(
        erc20Token,
        [owner.address, dex.address],
        [100, -100]
      );
    });
  });

  describe("Owner withdraw fund balance from Dex", function () {
    it("Should not allow non-owner to withdraw fund", async function () {
      await expect(dex.connect(user2).withDrawFund()).to.be.reverted;
    });

    it("Should allow owner to withdraw fund", async function () {
      expect(await dex.withDrawFund()).to.changeEtherBalances(
        [owner.address, dex.address],
        [500, -500]
      );
    });
  });
});
