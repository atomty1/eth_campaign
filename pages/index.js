import React, { useEffect, useState } from "react";
import factory from '../ethereum/factory';
import Link from 'next/link';
import Header from "../templates/header";
const Campaign= ({campaigns})=>{
  const renderCampaigns=()=>campaigns.map(address=>(
  <div style={{margin: "10px"}} key={address}>{address} 
  <button><Link href={`/campaigns/${address}`} >View Campaign</Link></button>
  </div>)
  );
    return(
    <Header>   
        {renderCampaigns()}
        <button>
          <Link href="/campaigns/new">
            <a>Create Campaign</a>
          </Link>
         
          </button>
    </Header>
    );
};
export async function getStaticProps() {
    const campaigns = await factory.methods.getDeployedCampaigns.call().call();
    return {
      props: {
        campaigns,
      },
    }
  }

  export default Campaign;