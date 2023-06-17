
const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { ethers } = require("hardhat");

// const tokens = (n) => {
//   return n*(1 ether)
//   console.log(n.toString())
// }
// try {
  const { ethers } = require("hardhat");
  const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
  }

  
  // } catch (error) {
    //   console.log(error)
    // }
    // tokens(2)
    const ID = 1
    const NAME = "Shoes"
    const CATEGORY = "Clothing"
    const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
    const COST = tokens(3)
    const RATING = 4
    const STOCK = 5
    
    describe("Dappazon",()=>{
      

      
      let Dappazon;
      let deployer;
      let buyer;
      let dappazon;
  
  // const getchainid=async()=>{
  //   const network = await ethers.getDefaultProvider().getNetwork();
  //   console.log("Network name=", network.name);
  //   console.log("Network chain id=", network.chainId);
  // }
  // getchainid();
  beforeEach(async()=>{
    Dappazon=await ethers.getContractFactory("Dappazon");
    [deployer,buyer]=await ethers.getSigners();
   
    // console.log(deployer,buyer)
    dappazon=await Dappazon.deploy();
  })

  describe("Testing Name",()=>{
    
    it('is it owner',async()=>{
      expect(await dappazon.owner()).to.equal(deployer.address)
    })

  })
  describe("Listing",()=>{

    let transaction

    beforeEach(async()=>{
      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()
    })

    it('Returns Item Attribute',async()=>{
      const item = await dappazon.items(ID)

      expect(item.id).to.equal(ID)
      expect(item.name).to.equal(NAME)
      expect(item.category).to.equal(CATEGORY)
      expect(item.image).to.equal(IMAGE)
      expect(item.cost).to.equal(COST)
      expect(item.rating).to.equal(RATING)
      expect(item.stock).to.equal(STOCK)
    })


    it('Emit List event',async()=>{
      expect(transaction).to.emit(dappazon,"List")
    })

  })


  describe("Buying", () => {
    let transaction

    beforeEach(async () => {
      // List a item
      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()
    })


    it("Updates buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.item.name).to.equal(NAME)
    })

    it("Updates the contract balance", async () => {
      const result = await dappazon.balanceOf()
      expect(result).to.equal(COST)
    })

    it("Emits Buy event", () => {
      expect(transaction).to.emit(dappazon, "Buy")
    })
  })
  describe("Withdraw", () => {
    let result;

    beforeEach(async () => {
      // List a item
      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK)
      await transaction.wait()

      // Buy a item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
      await transaction.wait()

      result = await dappazon.anotherContractBalance(deployer.address)
      // console.log("result",result)

      transaction=await dappazon.connect(deployer).withdraw();
      await transaction.wait()
    })
    
    it("deployer balance before withdraw and after withdraw", async () => {
      // console.log(deployer.address)
      const result2= await dappazon.anotherContractBalance(deployer.address)
      // console.log("result2",result2)
      expect(await result2).to.be.greaterThan(await result)
    })

    it('Updates the contract balance', async () => {
      const resultt = await dappazon.balanceOf()
      // console.log((resultt))
      expect(await resultt).to.equal(0)
    })

  })

})