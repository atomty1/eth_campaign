import { useRouter } from 'next/router';
import React, { useState } from 'react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import Header from '../../templates/header';
const CampaignNew= ()=>{
    const router = useRouter();
    const createCampaign = async ()=>{
        setSpinner("loading");
        try{
            const accounts =await web3.eth.getAccounts()
            await factory.methods.createCampaign(minimumContribution).
            send({from: accounts[0]});
            router.push("/");
        }catch(err){
            setError(err.message);
        }
        setSpinner("");
        
    }
    let [minimumContribution, setMinimum] = useState("");
    let [errorMessage, setError]= useState("");
    let [spinner, setSpinner] = useState("");
    return(
        <Header>
            <div>{spinner}</div>
            <small>{errorMessage}</small>
            <input onInput={event=>setMinimum(event.target.value)}/>
            <button onClick={createCampaign}>Create campaign</button>
        </Header>
    )
};

export default CampaignNew;