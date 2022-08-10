import Link from 'next/link';
import { useRouter } from 'next/router';
import React, {useState} from 'react';
import campaignInstance from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
const ViewRequest = ({campaignId, requests, approversCount, manager, complete})=>{
  let [error, setError] = useState("");
  const router = useRouter();
   
    const approveRequest = async index=>{
      setError("loading");
        try {
            const instance = campaignInstance(campaignId);
            const accounts = await web3.eth.getAccounts();
            await instance.methods.approveRequest(index).send({
                from: accounts[0]
            })
            setError("successful");
            router.replace(router.asPath);
        } catch (error) {
            setError(error.message);
        }
 
    }
    const finalizeRequest = async index=>{
      setError("loading");
      try {
        const instance = campaignInstance(campaignId);
        const accounts = await web3.eth.getAccounts();
        await instance.methods.finalizeRequest(index).send({
          from: accounts[0]
        });
        setError("successful");
        router.replace(router.asPath);
      } catch (error) {
        setError(error.message);
      }
    }
    // const router =useRouter();
    // const {query: {campaignId}} = router;
    return<>
        View Requests
        {manager}
        {error}
        <div>{requests.map(req=>(
            <div key={req.index}>
                <button>{req.index +1} </button>
               <div>description: {req.description}</div>
               <div>value: {req.value}</div>
               <div>recipient: {req.recipient}</div>
               <div>complete: {String(req.complete)}</div>
               <div>{req.approvalsCount}/{approversCount}</div>
               <button onClick={()=>approveRequest(req.index)}>Approve</button>
               <button onClick={()=>finalizeRequest(req.index)}>Finalize</button>
               
            </div>
        ))}</div>

    <button>
        <Link href={`/campaigns/${campaignId}/requests/new`}>
            Create new request
        </Link>
       
    </button>
    </>
}

export async function getServerSideProps(context) {
    const {query: {campaignId}} = context;
    const instance = campaignInstance(campaignId);
    const nums = await instance.methods.getRequestsCount().call();
    const approversCount = await instance.methods.approversCount().call();
    let manager = await instance.methods.manager().call();
    let requests = [];
    for (let index = 0; index < nums; index++) {
      let request= await instance.methods.requests(index).call();
    //   let {description, value, recipient, complete, approvalsCount }= request;
      requests.push({...request, index});
    }
    console.log(requests);
    return {
      props: {
        campaignId,
        requests,
        approversCount,
        manager
      },
    }
  }
export default ViewRequest;