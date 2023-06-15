
const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { ethers } = require("hardhat");

const tokens=()=>{
  return ethers.utils.parseUnits(n.toString(),'ethers')
}


describe("Dappazon",()=>{



  let Dappazon;
  let deployer;
  let buyer;
  let dappazon;


  beforeEach(async()=>{
    Dappazon=await ethers.getContractFactory("Dappazon");
    [deployer,buyer]=await ethers.getSigners();
    // console.log(deployer,buyer)
    dappazon=await Dappazon.deploy();
  })

  describe("Testing Name",()=>{
    it('has a name',async()=>{
      expect(await dappazon.name()).to.equal("Dappazon")
    })

    it('is it owner',async()=>{
      expect(await dappazon.owner()).to.equal(deployer.address)
    })
  })
})