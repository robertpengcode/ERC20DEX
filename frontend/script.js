const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;
const erc20TokenAbi = [
  "constructor(uint256 initialSupply)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool)",
  "function increaseAllowance(address spender, uint256 addedValue) returns (bool)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
];
const erc20TokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let erc20Token = null;
const dexAbi = [
  "constructor(address _token, uint256 _price)",
  "function buyToken(uint256 quantity) payable",
  "function getTokenBalance() view returns (uint256)",
  "function getTransactionValue(uint256 quantity) view returns (uint256)",
  "function transferToDexForSale()",
  "function withDrawFund()",
  "function withDrawTokens()",
];
const dexAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
let dex = null;

async function getAccess() {
  if (erc20Token) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  erc20Token = new ethers.Contract(erc20TokenAddress, erc20TokenAbi, signer);
  dex = new ethers.Contract(dexAddress, dexAbi, signer);
}
async function getPrice() {
  await getAccess();
  const tokenPrice = await dex.getTransactionValue(1);
  document.getElementById("tokenPrice").innerHTML = tokenPrice;
  return tokenPrice;
}
async function getDexBalance() {
  await getAccess();
  const dexBalance = await dex.getTokenBalance();
  document.getElementById("dexBalance").innerHTML = dexBalance;
  return dexBalance;
}
async function getUserBalance() {
  await getAccess();
  const myBalance = await erc20Token.balanceOf(await signer.getAddress());
  document.getElementById("myBalance").innerHTML = myBalance;
  return myBalance;
}
async function approveTokens() {
  await getAccess();
  const numberOfTokens = document.getElementById("approveToken").value;
  await erc20Token
    .approve(dexAddress, numberOfTokens)
    .then(() => alert("success!"))
    .catch((err) => alert(err));
}
async function transferTokensToDex() {
  await getAccess();
  await dex
    .transferToDexForSale()
    .then(() => alert("success!"))
    .catch((err) => alert(err));
}
async function withdrawTokens() {
  await getAccess();
  await dex
    .withDrawTokens()
    .then(() => alert("success!"))
    .catch((err) => alert(err));
}
async function withdrawFund() {
  await getAccess();
  await dex
    .withDrawFund()
    .then(() => alert("success!"))
    .catch((err) => alert(err));
}
async function buy() {
  await getAccess();
  const numberOfTokens = document.getElementById("buyToken").value;
  await dex
    .buyToken(numberOfTokens, { value: numberOfTokens * (await getPrice()) })
    .then(() => alert("success!"))
    .catch((err) => alert(err));
}
