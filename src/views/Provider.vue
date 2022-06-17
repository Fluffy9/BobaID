<template>
    <div class="container text-white">
        <b-jumbotron class="glass" header="Almost There!">
            <template #lead>
                Use your wallet to finish the connection. You will be asked to perform two transactions. These will store your <span style="text-transform: capitalize">{{$route.params['name']}}</span> account id (or another unique identifier) on-chain and attach it to your wallet address so that various dapps can access it.


            </template>
            <br>
            <connect v-if="!$store.state['network']"></connect>
            <div class="text-left" v-else>
                {{process.env}}
                <h2>Instructions</h2>
                <span>
                1. Type in your username and click the 'Publish ID' button.
                <br>
                2. After that transaction confirms click the "Prove ID" button.
                <br>
                Troubleshooting: The server will only fetch your data once per authorization code so if you cancel the transaction or it fails, start over and re-authorize with {{$route.params['name']}}
                </span>
                  <b-input-group>
                    <template #prepend>
                    <b-input-group-text class="text-capitalize" >Your {{$route.params['name']}}  Username</b-input-group-text>
                    </template>
                    <b-form-input v-model="username"></b-form-input>

                    <template #append>
                        <b-button variant="outline-light" @click="setUser()" v-if="!loading">Publish ID</b-button>
                        <b-button variant="outline-light" @click="proveUser()" v-if="!loading">Prove ID</b-button>
                        <b-button variant="outline-light" disabled v-else><span class="sr-only">Loading...</span><b-spinner small label="Spinning"></b-spinner></b-button>
                    </template>
                </b-input-group>
            </div>            
        </b-jumbotron>
    </div>
</template>
<script>
import Tile from '../components/Tile.vue'
import Connect from "../components/Connect.vue"
const ethers = require("ethers");
var abiCoder = ethers.utils.defaultAbiCoder;

export default {
    components: { Tile, Connect },
    data() {
        return {
          loading: false,  
          username: "",
          steps: [false, false],
          contract: "0x963a20cF7aD1c38c96B375bbE8BBA34cE34710b3"//"0xd1a8D5825cB67004dbe9c5a5045f708F98aCC5a8"
        }
    },
    methods: {
        async test2(){
            let contract = new ethers.Contract("0xefe992a50ecf45b5fadaca49438c144e82b064fd", require("../assets/ABI/test.json"), this.$store.state.signer)
            let gas = await contract.estimateGas["decodedTest(string)"]("test")
            await contract.decodedTest("test");
        },
        test1(){
            console.log(abiCoder.encode(["uint256"], [209342]))
            //let result = abiCoder.decode(["uint256"], "0x0000000000000000000000000000000000000000000000000000000001c62fcb")
            //console.log("decoded: ", result.map(x => x.toString()))
        },
        test(){
            // Convert a hex string to a byte array
            const hexToBytes = function(hex) {
                for (var bytes = [], c = 0; c < hex.length; c += 2)
                    bytes.push(parseInt(hex.substr(c, 2), 16));
                return bytes;
            }

            // Convert a byte array to a hex string
            const bytesToHex = function(bytes) {
                for (var hex = [], i = 0; i < bytes.length; i++) {
                    var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
                    hex.push((current >>> 4).toString(16));
                    hex.push((current & 0xF).toString(16));
                }
                return hex.join("");
            }
            let input = "0x00000000000000000000000000000000000000000000000000000000000000143862613630666531386130323333636462303564000000000000000000000000"
            input = input.substr(2)
            let n = 64
            let params = input.split(new RegExp("(.{"+n.toString()+"})")).filter(x => x.length == n);
            let str_length = parseInt(params[0], 16) * 2
            input = params[1]
            let bytes_object = hexToBytes(input.slice(0, str_length))
            let result = String.fromCharCode(...bytes_object)
            console.log("byte string: ", result)
            //http://localhost:8080/#/provider/github?state=MC40MTU3Mjg1NTQ3OTEwNjM0&code=e788e999d4a8427d3f19
        },
        toggleLoading(){
            this.loading = this.loading ? false : true 
        },
        checkState(params, state){
            if(!params["state"] || state == params["state"]){
                return true
            } else {
                this.$bvToast.toast("State variable does not match. Please restart authentication flow", {
                    variant: "danger",
                    title: "Error"
                })
            }
            return false;
        },
        async sendTransaction(tx){
            await this.$store.state.send(tx, this.$store.state.provider).then(recipt => {
                this.$bvToast.toast("The transaction was sent", {
                    variant: "success",
                    title: "Success"
                })
                return true
            }).catch(err => {
                this.$bvToast.toast(err['message'], {
                    variant: "danger",
                    title: "Error"
                })
                return false
            })
        },
        async proveUser(){
            const state = localStorage.getItem('state') 
            const params = this.$route.query;
            const username = this.username
            if(!username) return
            if (!this.checkState(params, state)) return
            this.toggleLoading();
            let user = await fetch("https://api.github.com/users/"+username)
            if(!user.ok){ 
                this.$bvToast.toast("Could not retrieve user account for " + username, {
                    variant: "danger",
                    title: "Error"
                })
                return
            }
            user = await user.json()
            let code = params["code"]
            let contract = new ethers.Contract(this.contract, require("../assets/ABI/oAuthGithub.json"), this.$store.state.signer)
            let tx = await contract.populateTransaction.proveUser(user.id, code);
            await this.sendTransaction(tx)
            this.toggleLoading();

        },
        async setUser(){
            let state = localStorage.getItem('state') 
            const params = this.$route.query;
            if (!this.checkState(params, state)) return
            let code = params["code"]
            let contract = new ethers.Contract(this.contract, require("../assets/ABI/oAuthGithub.json"), this.$store.state.signer)
            let tx = await contract.populateTransaction.setUser(code)
            this.toggleLoading()
            let success = await this.sendTransaction(tx)
            if(success){ 
                this.proveUser()
            }
            this.toggleLoading()

        },
        async getAccessToken(){
            let state = localStorage.getItem('state') 
            const params = this.$route.query;
            const route = this.$route.params['name']
            if(!params["state"] || state == params["state"]){
                let code = params["code"]
                let res = await fetch(this.$store.state.server + route, {
                    method: "POST",
                    body: JSON.stringify({
                        code: abiCoder.encode(["string"], [code]),
                    })
                })
                if(!res.ok){
                    this.$bvToast.toast("The code is expired or incorrect", {
                        variant: "danger",
                        title: "Error"
                    })
                }     
                let userID = await res.text()
                console.log(abiCoder.decode(["uint256"],userID).toString())               
            }
        }
    }
}
</script>
<style scoped>
.glass {
    background: rgba( 255, 255, 255, 0.25 );
    /* box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 ); */
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
}
</style>