import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance  = new web3.eth.Contract(
    campaignFactory.abi,
    '0x749d69565e7bCB7125cd248f682631e2AFEEc2D5'
);
export default instance;