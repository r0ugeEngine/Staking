// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers;
const BigNumber = ethers.BigNumber;
const Erc20Artifacts = require("../artifacts/contracts/ERC20Updated.sol/ERC20Updated.json")

// let { selfFarm, tokenOne, tokenTwo, staking } = require("./deploy")

async function main() {
	console.log("Minting script ran")
	console.log("-----------------------------------------------------------------------------------")

	// one token value = 1e18
	// to mint 10 tokens, we need to multiply the value of one token by 10
	const oneTokenVal = BigNumber.from("1000000000000000000");

	// take owner of {StakingRewards} contract and 3 accounts
	const [owner, staker1, staker2, staker3] = await ethers.getSigners()

	// linked deployed {selfFarmToken}
	const selfFarmContract = new ethers.Contract(
		"0x5FbDB2315678afecb367f032d93F642f64180aa3",
		Erc20Artifacts.abi,
		owner
	)

	// linked deployed {tokenOneToken}
	const tokenOneContract = new ethers.Contract(
		"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
		Erc20Artifacts.abi,
		owner
	)

	// linked deployed {tokenTwoToken}
	const tokenTwoContract = new ethers.Contract(
		"0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
		Erc20Artifacts.abi,
		owner
	)

	// Minting 100000 SFT tokens for {StakingRewards} contract
	await selfFarmContract.mint("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", oneTokenVal.mul(100000))
	// read the balance of SFT tokens on the {StakingRewards} contract
	const stakingContractBalance = await selfFarmContract.balanceOf("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9")
	console.log("Staking Contract { 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9 } SFT: ", stakingContractBalance.div(oneTokenVal), " * 1e18 tokens")

	console.log("-----------------------------------------------------------------------------------")

	// Minting 1000 SFT tokens for {staker1}
	await selfFarmContract.mint(staker1.address, oneTokenVal.mul(1000))
	// read the balance of SFT tokens on the {staker1}'s account
	const staker1Sft = await selfFarmContract.balanceOf(staker1.address)
	// read the balance of ONE tokens on the {staker1}'s account
	const staker1One = await tokenOneContract.balanceOf(staker1.address)
	// read the balance of TWO tokens on the {staker1}'s account
	const staker1Two = await tokenTwoContract.balanceOf(staker1.address)
	// increase {staker1}'s allowance to Staking Rewards contract
	const increaseAllowanceByStaker1 = await selfFarmContract.connect(staker1).increaseAllowance("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", staker1Sft)
	await increaseAllowanceByStaker1.wait()
	// check {staker1}'s balance
	console.log("Staker1 {", staker1.address, "} SFT: ", staker1Sft.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker1 {", staker1.address, "} ONE: ", staker1One.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker1 {", staker1.address, "} TWO: ", staker1Two.div(oneTokenVal), " * 1e18 tokens")

	console.log("-----------------------------------------------------------------------------------")

	// Minting 1000 ONE tokens for {staker2}
	await tokenOneContract.mint(staker2.address, oneTokenVal.mul(1000))
	// read the balance of SFT tokens on the {staker2}'s account
	const staker2Sft = await selfFarmContract.balanceOf(staker2.address)
	// read the balance of ONE tokens on the {staker2}'s account
	const staker2One = await tokenOneContract.balanceOf(staker2.address)
	// read the balance of TWO tokens on the {staker2}'s account
	const staker2Two = await tokenTwoContract.balanceOf(staker2.address)
	// increase {staker2}'s allowance to Staking Rewards contract
	const increaseAllowanceByStaker2 = await tokenOneContract.connect(staker2).increaseAllowance("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", staker2One)
	await increaseAllowanceByStaker2.wait()
	// check {staker2}'s balance
	console.log("Staker2 {", staker2.address, "} SFT: ", staker2Sft.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker2 {", staker2.address, "} ONE: ", staker2One.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker2 {", staker2.address, "} TWO: ", staker2Two.div(oneTokenVal), " * 1e18 tokens")

	console.log("-----------------------------------------------------------------------------------")

	// Minting 1000 TWO tokens for {staker3}
	await tokenTwoContract.mint(staker3.address, oneTokenVal.mul(1000))
	// read the balance of SFT tokens on the {staker3}'s account
	const staker3Sft = await selfFarmContract.balanceOf(staker3.address)
	// read the balance of ONE tokens on the {staker3}'s account
	const staker3One = await tokenOneContract.balanceOf(staker3.address)
	// read the balance of TWO tokens on the {staker3}'s account
	const staker3Two = await tokenTwoContract.balanceOf(staker3.address)
	// increase {staker3}'s allowance to Staking Rewards contract
	const increaseAllowanceByStaker3 = await tokenTwoContract.connect(staker3).increaseAllowance("0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9", staker3Two)
	await increaseAllowanceByStaker3.wait()
	// check {staker3}'s balance
	console.log("Staker3 {", staker3.address, "} SFT: ", staker3Sft.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker3 {", staker3.address, "} ONE: ", staker3One.div(oneTokenVal), " * 1e18 tokens")
	console.log("Staker3 {", staker3.address, "} TWO: ", staker3Two.div(oneTokenVal), " * 1e18 tokens")

	console.log("-----------------------------------------------------------------------------------")
	console.log("Minting script ended")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
