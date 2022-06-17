import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
const { providers, Wallet, ethers, BigNumber } = require("ethers");
const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
const server = process.env['VUE_APP_SERVER']
export default new Vuex.Store({
  state: {
    web3Modal: null,
    provider: null,
    network: null,
    signer: null,
    user: null,  
    supportedNetworks: [{"Boba Rinkeby": 28}],
    //contract: markRaw(new ethers.Contract("0x503cdba19c484fc4aec22f0e8f3dc37a5c327c27", require("../../../ABI/Babysitter.json"), new providers.JsonRpcProvider({ url: RPC }, CHAIN_ID))),
    send: async function(tx, provider){
      await provider.send('eth_sendTransaction',[{from: tx.from, to: tx.to, data: tx["data"], value: tx["value"]}])
    },
    server: server,
    oAuthState: null,
    oAuth: [
      {name: "Github", icon: "github", authorize_url: "https://github.com/login/oauth/authorize", token_url: "https://github.com/login/oauth/access_token", scope: "profile", redirect_uri: (server + "redirect/github"), client_id: process.env['VUE_APP_GITHUB_CLIENT_ID']}, 
      {name: "Discord" , icon: "discord", disabled: "true", baseURL: "", scope: "bobaid", redirect_uri: (server + "redirect/discord"), client_id: ""}, 
      {name: "Google", icon: "google", disabled: "true", baseURL: "", scope: "bobaid", redirect_uri: (server + "redirect/google"), client_id: ""}, 
      // {name: "HumanNode", icon: "triangle-fill", disabled: "true", baseURL: "", scope: "bobaid", redirect_uri: (server + "redirect/humannode"), client_id: ""},
      {name: "Twitter", icon: "twitter", disabled: "true", baseURL: "", scope: "bobaid", redirect_uri: (server + "redirect/twitter"), client_id: ""},
    ]
  },
  mutations: {
    setoAuthState(state, payload){
      state.oAuthState = payload
    },
    setWeb3Modal(state, payload){
      state.web3Modal = payload //markRaw(payload)
    },
    setSigner(state, payload){
      state.signer = payload //markRaw(payload)
    },
    setProvider(state, payload){
      state.provider = payload //markRaw(payload)
    },
    setNetwork(state, payload){
      state.network = payload 
    },
    setUser(state, payload){
      state.user = payload
    }, 
  },
  actions: {
    init(){
      let state = localStorage.getItem('state') 
      if(!state){
        state = btoa(Math.random()).replace(/\W/g, '');
      }
      localStorage.setItem('state', state)
    },
    async Connect({ state, commit }) {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider, // required
          options: {
            infuraId: "INFURA_ID" // required
          }
        }
      };
      const web3Modal = new Web3Modal({
        cacheProvider: true, // optional
        providerOptions // required
      });

      const provider = new providers.Web3Provider(await web3Modal.connect());
      const signer = provider.getSigner();
      let network = (await provider.getNetwork()).chainId
      network = state.supportedNetworks.find(x => Object.values(x)[0] === network)
      network = network == undefined ? undefined : Object.keys(network)[0]
      console.log(network)
      commit('setSigner', signer)
      commit('setUser', await signer.getAddress())
      commit('setProvider', provider)
      commit('setNetwork', network)
      commit('setWeb3Modal', web3Modal)
      //commit('setContract', markRaw(new ethers.Contract("0x503cdba19c484fc4aec22f0e8f3dc37a5c327c27", require("../../../ABI/Babysitter.json"), signer)))
    },
    async Disconnect({ state, commit }) {
      await state.web3Modal.clearCachedProvider();
      commit('setSigner', null)
      commit('setProvider', null)
      commit('setNetwork', null)
      window.location.reload();
    },
  },
  modules: {
  }
})
