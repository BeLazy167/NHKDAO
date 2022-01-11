// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // We get the contract to deploy
  const [owner,user1,user2] = await ethers.getSigners();
  const NhkToken = await hre.ethers.getContractFactory("NhkToken");
  const NhkTokenContract = await NhkToken.deploy();
  await NhkTokenContract.deployed();

  console.log("NhkToken Address", NhkTokenContract.address);

  let totalSupply = (await NhkTokenContract.balanceOf(owner.address)).toNumber();
  console.log("Nhk total Supply",totalSupply);

  const NhkTokenBurn = await hre.ethers.getContractFactory("Burn");
  const NhkTokenBurnContract = await NhkTokenBurn.deploy(NhkTokenContract.address);
  await NhkTokenBurnContract.deployed();

  NhkTokenContract.transfer(NhkTokenBurnContract.address,totalSupply/2);
  console.log("token for burn",(await NhkTokenContract.balanceOf(NhkTokenBurnContract.address)).toNumber());

  console.log("Owner Balance",(await NhkTokenContract.balanceOf(owner.address)).toNumber());

  const NhkTokenClaim = await hre.ethers.getContractFactory("Claim");
  const NhkTokenClaimContract = await NhkTokenClaim.deploy(NhkTokenContract.address);
  await NhkTokenClaimContract.deployed();

  NhkTokenContract.transfer(NhkTokenClaimContract.address,totalSupply/2);
  console.log("token for Claim",(await NhkTokenContract.balanceOf(NhkTokenClaimContract.address)).toNumber());

  let claimTxn1 = await NhkTokenClaimContract.connect(user1).claim();
  await claimTxn1.wait();

//   console.log("Claim Transaction",claimTxn1);
  console.log("User1 Balance",(await NhkTokenContract.balanceOf(user1.address)).toNumber());

  let burnTxn1 = await NhkTokenBurnContract.connect(user1).burn(5);
  await burnTxn1.wait();

//   console.log("Burn Transaction",burnTxn1);
  console.log("User1 Balance",(await NhkTokenContract.balanceOf(user1.address)).toNumber());
//   console.log("Burn Address Token",(await NhkTokenContract.balanceOf(address(0))).toNumber())
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });