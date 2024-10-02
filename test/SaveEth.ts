import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";

  describe('SaveEther', () => {
    async function deploySaveEth() {
    
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const saveEth = await hre.ethers.getContractFactory("SaveEth");
        const saveEther = await saveEth.deploy();

        return { saveEther, owner, otherAccount };
    }

    describe('CreateAccount', () => { 
        it("Should not allow zero account", async () => {
            const { saveEther, otherAccount } = await loadFixture(deploySaveEth);
            expect(await saveEther.createAccount(otherAccount)).to.be.revertedWith("Address zero detected");
        });

        it("Should check if Address is an Ether Address.", async () => {
            const { saveEther, owner, otherAccount } = await loadFixture(deploySaveEth);
            expect(await saveEther.createAccount(owner)).to.be.revertedWith("Not an Ether address");
        });

        it("Should check if account is created successfully.", async () => {
            const { saveEther, owner, otherAccount } = await loadFixture(deploySaveEth);
            expect(await saveEther.createAccount(owner)).to.not.be.reverted;
        });
     })

     describe('Deposit', () => {
        it("Should not allow unregistered addresses", async () => {
            const { saveEther, owner, otherAccount } = await loadFixture(deploySaveEth);
            expect(await saveEther.createAccount(otherAccount)).to.not.be.reverted;
            const amountToTransfer = ethers.parseEther("1.0");
            expect(await saveEther.connect(otherAccount).deposit({value: amountToTransfer})).to.not.revertedWith("You do not have an account");
        });

        // it("Should allow registered addresses", async () => {
        //     const { saveEther, owner, otherAccount } = await loadFixture(deploySaveEth);
        //     expect(await saveEther.createAccount(otherAccount)).to.not.be.reverted;
        //     const amountToTransfer = ethers.parseEther("1.0");
        //     expect (await saveEther.connect(otherAccount).deposit({value: amountToTransfer})).to.changeEtherBalance(otherAccount, -amountToTransfer);
        //     const deposiT = saveEther.connect(otherAccount).deposit({value: amountToTransfer});
        // });


     });

    

 });