<template>
  <div>
    <b-button title="Connect your wallet" size="lg" v-if="!$store.state.user" variant="light" @click="Connect()"><b-icon-wallet-2></b-icon-wallet-2></b-button>
    <div v-else-if="$store.state.network != undefined">
        <b-avatar style="border: solid 2px white" alt="Ethereum blockies avatar" :src="blocky" :title="$store.state.user" @click="toggle()"></b-avatar>
        <!-- <b-badge variant="light" class="ml-2">{{$store.state.network}}</b-badge> -->
        <!-- <b-badge variant="light" class="ml-2">{{$store.state.user.substring(0,10)}}...</b-badge> -->
    </div>
    <div v-else><b-badge variant="danger">Unsupported Network</b-badge></div>
  </div>
</template>
<script>
import makeBlockie from 'ethereum-blockies-base64';
import { BIconWallet2 } from 'bootstrap-vue'

export default {
    name: "Connect",
    components: { BIconWallet2 },
    data(){
        return {
            dialog: false,
        }
    }, 
    methods: {
        async Connect(){
            this.$store.dispatch("Connect")
        },
        async Disconnect(){
            this.$store.dispatch("Connect")
        },
        toggle(){
            let modal = document.getElementById('dialog-default');  
            this.dialog = this.dialog ? false : true
            this.dialog ? modal.showModal() : modal.close();
        }
    },
    computed: {
        signer(){
            return this.$store.state.signer
        },
        blocky(){
            let user = this.$store.state.user
            if(user){
                return makeBlockie(user);
            }
            return ""
        }
    }
}

</script>