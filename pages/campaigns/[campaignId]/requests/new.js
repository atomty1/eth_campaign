import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { useState } from 'react';
import campaignInstance from '../../../../ethereum/campaign';
import web3 from '../../../../ethereum/web3';
const NewRequest = ()=>{
    const {query: {campaignId}} = useRouter();

    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');
    const createRequest= async ()=>{
        setError("loading");
        try {
            const accounts = await web3.eth.getAccounts();
            const instance = campaignInstance(campaignId);
            const summary = await instance.methods.getSummary().call();
            // console.log(summary["4"]);
            await instance.methods.createRequest(description, value, recipient)
            .send({from: accounts[0]}); 
            setError("succcess");
        } catch (error) {
            setError(error.message);
        }

    }
    return<>
            <Link href={`/campaigns/${campaignId}/requests`}>
                 Go back
            </Link>
        {/* <form> */}
            {error}
            <input onInput={e=>setDescription(e.target.value)} placeholder='description'/>
            <input onInput={e=>setValue(e.target.value)} placeholder='value'/>
            <input onInput={e=>setRecipient(e.target.value)} placeholder='recipient'/>
            <button onClick={createRequest}>create request</button>


        {/* </form> */}
    
    </>
}
export default NewRequest;