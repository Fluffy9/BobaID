<template>
  <div id="app" class="h-100 w-100">
    <b-navbar toggleable="sm" type="light">
      <b-navbar-brand role="button" title="Home" v-if="$router.currentRoute.path != '/'" to="/"><b-icon class="text-white" icon="house"></b-icon></b-navbar-brand>
            <b-collapse id="nav-text-collapse" is-nav>
        <b-navbar-nav>
          <!-- <b-nav-item to="/About">About</b-nav-item> -->
          <!-- <b-nav-item to="/Send">Send <b-icon-chat></b-icon-chat></b-nav-item>
          <b-nav-item to="/Recieve">Recieve <b-icon-chat></b-icon-chat></b-nav-item> -->
        </b-navbar-nav>
      </b-collapse>
      <b-navbar-nav>
        <connect v-if="$store.state['network'] != undefined"></connect>
      </b-navbar-nav>
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>
    </b-navbar>
    <div>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<style lang="scss">
$primary: #b0def6;
$gradient: linear-gradient(90deg, rgba(176,222,246,1) 0%, rgba(250,201,194,1) 50%, rgba(255,238,96,1) 100%);
$dark: #0D040D;
//$body-bg: #e0dfd6;
$body-bg: white;
$link-color: gray;
$link-hover-color: darken($link-color, 15%);
$theme-colors: (
  "primary": $primary,
  "secondary": #fac9c2,
  "warning": #ffee60,
  "info": #a1c8ab,
  "light": $body-bg,
  "dark": $dark,
  //...other variables, you can find them in node_modules/bootstrap/scss/_variables.scss
);

// Import Bootstrap and BootstrapVue source SCSS files
@import "~bootstrap/scss/bootstrap.scss";
@import "~bootstrap-vue/src/index.scss";
@import "~bootstrap-vue/src/icons.scss";
@import url('https://fonts.googleapis.com/css2?family=Londrina+Outline&family=Press+Start+2P&display=swap');
@font-face {
  font-family: "Inter";
  src: url("./assets/Inter/Inter.ttf") format("truetype");
}
body {
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 400% 400%;
	animation: gradient 30s ease infinite;
	height: 100vh;  
}
// #main {
//   height: 90%;
//   width: 100%;
//   background-image : linear-gradient(to top, rgba(255,255,255, 0) 0%, rgba(255,255,255, 1) 15%, rgba(255,255,255, 1) 85%, rgba(255,255,255, 0) 100%);
// }

@keyframes gradient {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}


#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: Inter;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $dark
  // color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.15s;
}

.fade-enter-active {
  transition-delay: 0.15s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

</style>
<script>
import Connect from "./components/Connect.vue"
import { BIcon, BIconHouse} from 'bootstrap-vue'

export default {
  components: { Connect, BIcon, BIconHouse }
}
</script>