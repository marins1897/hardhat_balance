const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Token contract', () => {
    let Token, token, owner, addr1, addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory('Token'); // built in hardhat-ethers method
        token = await Token.deploy();
        [owner, addr1, addr2] = await ethers.getSigners();
    });

    describe('Deloyment', () => {
        it('Should set the right owner', async () => {
            expect(await token.owner()).to.equal(owner.address);
        });

        it('Should assign the total supply of tokens to the owner', async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
        });
    });

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            // transfer from owner to addr1
            await token.transfer(addr1.address, 50);
            const addr1Balance = await token.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            // transfer from addr1 to addr2
            await token.connect(addr1).transfer(addr2.address, 50); // .connect(address) - from which account to make transfer
            const addr2Balance = await token.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        // expect failed transfer
        // addr1 currently have 0 tokens so it will fail
        it('Should not allow transfer if sender does not have enough balance', async () => {
            const initalOwnerBalance = await token.balanceOf(owner.address);

            await expect(
                token
                    .connect(addr1) // from addr1
                    .transfer(owner.address, 1) // 1 token to owner
            )
                .to.be.revertedWith("Not enough tokens!"); // give me my error message
            
            expect(await token.balanceOf(owner.address)).to.equal(initalOwnerBalance); // transfer fails so the balance of owner is the same as in the beggining
        });

        // check if the balances are correct after transfer
        // we can make transfer from owner address because his balance = totalSupply
        it('Should update balances after transfer', async () => {
            const initalOwnerBalance = await token.balanceOf(owner.address);

            await token.transfer(addr1.address, 100);
            await token.transfer(addr2.address, 50);

            const finalOwnerBalance = await token.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initalOwnerBalance - 150);

            const finalAddr1Balance = await token.balanceOf(addr1.address);
            expect(finalAddr1Balance).to.equal(100);

            const finalAddr2Balance = await token.balanceOf(addr2.address);
            expect(finalAddr2Balance).to.equal(50);
        })
    });
})