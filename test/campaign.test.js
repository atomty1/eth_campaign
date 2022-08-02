const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts, factory, campaignAddress, campaign;

beforeEach(async  ()=>{
    accounts=  await web3.eth.getAccounts();
   
    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({data: compiledFactory.evm.bytecode.object})
    .send({from: accounts[0], gas: '5000000'});
   
    await factory.methods.createCampaign('10000')
    .send({from: accounts[0], gas: '5000000'});

    [campaignAddress]= await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(compiledCampaign.abi,
        campaignAddress);
  });
  describe("Campaigns", ()=>{
    it("deploys a factory in a campaign", ()=>{
      // console.log(factory);
      assert.ok(factory.options.address);
      assert.ok(campaign.options.address);
    });
    it("check if campaign creator is manager", async()=>{
      let campaignManager = await campaign.methods.manager().call();
      assert.equal(accounts[0], campaignManager);
    });
    it("check minimum contribution",async ()=>{
      try {
        await campaign.methods.contribute().send({from: accounts[1], value: 5000 });
        throw(false);
      } catch (error) {
        assert.ok(error);
      }
        
    });
    it("Ability to contribute to a campaign",async ()=>{
      let contributor = accounts[1];
      await campaign.methods.contribute().send({from: contributor, value: 15000 });
      let fetchApprover = await campaign.methods.approvers(contributor).call();
      assert.ok(fetchApprover);
    });
    it("Checks if manager is creating request", async ()=>{
      try {
        await campaign.methods.createRequest("Buy Goods", 4000, accounts[5])
        .send({from: accounts[1], gas: "5000000"});
        throw(false);
      } catch (error) {
        assert.ok(error);
      }
    });
    it("Checks if request is created", async ()=>{
      let message = "Pay designer";
      await campaign.methods.createRequest(message, 4000, accounts[5])
      .send({from: accounts[0], gas: "5000000"});
      let req =  await campaign.methods.requests(0).call();
      assert.equal(message, req.description);

    });
    // it("Check if contributor can approve request", async()=>{
    //      await campaign.methods.contribute().send({from: accounts[1], value: 15000 });
    //      await campaign.methods.createRequest("buy goods", 4000, accounts[5])
    //      .send({from: accounts[0], gas: "5000000"});
    //      await campaign.methods.approveRequest(0).send({
    //       from: accounts[1], gas: "5000000"
    //      });
    //      let res =await campaign.methods.requests(0).call();

    // })
    it("processes request", async()=>{
      await campaign.methods.contribute().send({from: accounts[1], value: 15000000 });
      await campaign.methods.contribute().send({from: accounts[2], value: 15000000 });
      await campaign.methods.contribute().send({from: accounts[3], value: 15000000 });
      await campaign.methods.createRequest("buy goods", 15000000, accounts[5])
      .send({from: accounts[0], gas: "5000000"});
      await campaign.methods.approveRequest(0).send({
        from: accounts[1], gas: "5000000"
      });
      await campaign.methods.approveRequest(0).send({
        from: accounts[2], gas: "5000000"
      });
      let initialBalance = await web3.eth.getBalance(accounts[5]);
      await campaign.methods.finalizeRequest(0).send({
        from: accounts[0], gas: "5000000"
      });
      let finalBalance = await web3.eth.getBalance(accounts[5]);
      let dif = finalBalance-initialBalance;
      console.log("difference", dif);
      assert(dif>14000000);
    });


  })