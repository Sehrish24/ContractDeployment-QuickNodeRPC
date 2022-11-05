const { ethers, run, network } = require("hardhat")

async function main() {
    // this helps in deploying the contract
    const ChatAppFactory = await ethers.getContractFactory("ChatApp")
    console.log("Deploying contract...")
    const ChatApp = await ChatAppFactory.deploy()
    await ChatApp.deployed()
    console.log(`Deployed contract to: ${ChatApp.address}`)

    //-------------------- verifying our contract on etherscan ----------------
    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        await ChatApp.deployTransaction.wait(6)
        await verify(ChatApp.address, [])
    }

    //--------------------- interacting with the contract ---------------------
    const message = await ChatApp.getMessage()
    console.log(`Current Message: ${message}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying the contract...")

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified.")
        } else {
            console.log(e)
        }
    }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
