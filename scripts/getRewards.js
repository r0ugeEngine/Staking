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
const StakingArtifacts = require("../artifacts/contracts/StakingRewards.sol/StakingRewards.json")

async function main() {
	console.log("Get Rewards script ran")
	console.log("----------------------------------------------------------------------------------------------------------")

	const oneTokenVal = BigNumber.from("1000000000000000000");

	// take owner of Staking contract and 3 accounts
	const [owner, staker1, staker2, staker3] = await ethers.getSigners()

	// linked deployed {stakingContract}
	const sRContract = new ethers.Contract(
		"0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
		StakingArtifacts.abi,
		owner
	)

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

	// Checking the {stakingContract} balance before issuing a reward
	// read the balance of SFT tokens on the Staking Rewards contract before staking
	await _balanceOf(sRContract.address, true, "before")

	console.log("-----------------------------------------------------------------------------------")

	// Rewards for 3 stakers

	// gets {staker1}'s rewards
	// { gasLimit: 3e7 } needs for avoid gal limit error
	const staker1getRewards = await sRContract.connect(staker1).getRewards({ gasLimit: 3e7 })
	await staker1getRewards.wait()
	// read {staker1}'s balance
	await _balanceOf(staker1.address, false, "after getting rewards")

	console.log("-----------------------------------------------------------------------------------")

	// gets {staker2}'s rewards
	// { gasLimit: 3e7 } needs for avoid gal limit error
	const staker2getRewards = await sRContract.connect(staker2).getRewards({ gasLimit: 3e7 })
	await staker2getRewards.wait()
	// read {staker2}'s balance
	await _balanceOf(staker2.address, false, "after getting rewards")

	console.log("-----------------------------------------------------------------------------------")

	// gets {staker3}'s rewards
	// { gasLimit: 3e7 } needs for avoid gal limit error
	const staker3getRewards = await sRContract.connect(staker3).getRewards({ gasLimit: 3e7 })
	await staker3getRewards.wait()
	// read {staker3}'s balance
	await _balanceOf(staker3.address, false, "after getting rewards")

	console.log("-----------------------------------------------------------------------------------")

	// Checking the {stakingContract} balance after issuing a reward
	// read the balance of SFT tokens on the Staking Rewards contract after staking
	await _balanceOf(sRContract.address, true, "after")

	console.log("----------------------------------------------------------------------------------------------------------")
	console.log("Get Rewards script ended")

	async function _balanceOf(address, isContract, when) {
		let stakerOrContract = "Staker"
		if (isContract) {
			stakerOrContract = "SR Contract"
		}

		const sftBalance = await selfFarmContract.balanceOf(address)
		console.log(stakerOrContract, " {", address, "} SFT ", when, ": ", sftBalance, " tokens")
	}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});