import { useRouter } from 'next/router';
import React, { useState } from 'react';
import campaignInstance from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import Header from '../../../templates/header';
import Link from 'next/link';
const LoadOneCampaign = ({
       
        campaignId,
        minimumContribution,
        balance,
        numRequest,
        approversCount,
        // manager,
     
})=>{
  let [amount, setAmount] = useState('');
  let [error, setError] = useState('');
  const router = useRouter();
    // const {query: {campaignId}} = useRouter();
    // const instance = campaignInstance(campaignId);
    const contributeToCampaign = async ()=>{
      setError("loading")
      try {
        const instance = campaignInstance(campaignId);
        const accounts =await web3.eth.getAccounts()
        await instance.methods.contribute().send({
        value: amount,
        from: accounts[0]
      });
        setError("successful");
        router.replace(router.asPath);
      } catch (error) {
        setError(error.message);
      }
      
      
    }
    
    return(
     <Header>
        The campaign id is {campaignId}
        <div>Campaign balance: {balance}</div>
        <div>Minimum contribution: {minimumContribution}</div>
        <div>Pending request: {numRequest}</div>
        <div>Contributors: {approversCount} </div>
        <small>{error}</small>
        <input onInput={e=>setAmount(e.target.value)}/>
        <button onClick={contributeToCampaign}>Contribute</button>
        <button>
          
          <Link href={`${campaignId}/requests`}>
            View Requests
          </Link>
          
        </button>
    </Header>  
    )
}
export  async function getServerSideProps(context) {
  
  const {query: {campaignId}} = context;
  const instance = campaignInstance(campaignId);
  const summary = await instance.methods.getSummary().call();
  const {'0':minimumContribution, '1': balance,
  '2': numRequest, '3': approversCount, '4': manager}= summary;
 
    // console.log(campaignId);
    // let res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    // console.log(res);
    // const campaigns = await factory.methods.getDeployedCampaigns.call().call();
    return {
        //  paths: [], fallback: false 
      props: {
       
        campaignId,
        minimumContribution,
        balance,
        numRequest,
        approversCount,
        manager
      },
    }
  }

export default LoadOneCampaign;