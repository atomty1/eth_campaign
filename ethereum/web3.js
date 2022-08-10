import Web3 from 'web3';
// window.ethereum.request({ method: "eth_requestAccounts" });
let web3;
if(typeof window !=="undefined" && typeof window.web3 !=="undefined"){
    web3 = new Web3(window.ethereum);

}else{
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/596ceea915dd418e95c695cc2a03f41c"
    );
    web3 = new Web3(provider);
}
export default web3;