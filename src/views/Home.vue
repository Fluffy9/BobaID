<template>
    <div class="container text-white text-left mt-2">
        <b-row>
            <b-col class="justify-content-center align-self-center mr-2">
                <b-badge variant="dark">Version 1.0.0-Alpha</b-badge>
                <h1 class="display-1" style="text-shadow: 2px 2px 5px rgb(31 38 135 / 40%); font-weight: bolder">BobaID <b-icon-person-badge></b-icon-person-badge></h1>
                <i>Now available on Boba Rinkeby</i><br>
                <p class="lead">The social authentication layer on Boba Network. Connect to oAuth providers such as Github, Discord and others to access Sybil protected Dapps</p>
                <b-button class="mr-2" variant="light" href="https://github.com/Fluffy9/BobaID">Docs</b-button>
                <!-- <b-button class="ml-2" variant="outline-light">Docs</b-button> -->
            </b-col>
            <b-col>
                <div class="container">
                    <b-row class="mt-4" v-for="i in Math.ceil(providers.length / 3)" :key="i">
                        <b-col cols="4" v-for="provider in providers.slice((i-1) * 3, i * 3)" :key="provider.name">
                            <a v-if="!provider['disabled']" class="text-reset text-decoration-none" target="_blank" rel="noopener noreferrer" :href="authorizationURL(provider)">
                                <tile role="button" class="pulse" :icon="provider.icon" :name="provider.name" :disabled="provider['disabled'] || false"></tile>
                            </a>
                            <tile v-else :icon="provider.icon" :name="provider.name" :disabled="provider['disabled'] || false"></tile>

                        </b-col>
                    </b-row>
                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import Tile from '../components/Tile.vue'
import { BIcon, BIconPersonBadge, BIconBinoculars } from 'bootstrap-vue'

export default {
  components: { Tile, BIcon, BIconPersonBadge, BIconBinoculars },
  computed: {
      providers(){
          return this.$store.state.oAuth
      }
  },
  methods: {
    authorizationURL(provider){  
      let state = localStorage.getItem('state')
      let url = provider.authorize_url + `?response_type=code&client_id=${provider.client_id}&scope=${provider.scope}&state=${state}&redirect_uri=${provider.redirect_uri}`;
      return url    
    }
  },
  mounted(){
      this.$store.dispatch("init")
  }
}
</script>
<style scoped>
.pulse {
    transform: scale(1);
    transition: transform 0.5s;
}
.pulse:hover {
    /* animation: pulse 2s infinite; */
    transform: scale(0.9) rotate(3deg);
    transition: transform 0.5s;

}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); */
    }

    70% {
        transform: scale(1);
        /* box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); */
    }

    100% {
        transform: scale(0.95);
        /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); */
    }
}
</style>