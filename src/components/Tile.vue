<template>
    <div class="tile-shadow embed-responsive embed-responsive-1by1" :title="disabled ? name + ' coming soon' : 'Connect to BobaID with ' + name">
        <b-card :class="(disabled ? 'tile-disabled ' : 'tile ') + 'embed-responsive-item'">
            <div :class="disabled ? 'text-muted': 'text-white'" style="width:100%; height: 100%">
                <b-avatar variant="transparent" :icon="icon" class="h-100 w-100"></b-avatar>
            </div>

        </b-card>
    </div>
</template>
<style scoped>
    .tile-disabled {
        background: rgba( 255, 255, 255, 0.05 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
        transform: scale(1);
        transition: transform 1s; 
    }
    .tile {
        background: rgba( 255, 255, 255, 0.25 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
        transform: scale(1);
        transition: transform 1s; 
    }
    .tile-shadow {
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.2 );

    }


</style>
<script>
import { BIcon, BIconDiscord, BIconGithub, BIconGoogle, BIconTriangleFill, BIconTwitter } from 'bootstrap-vue'

export default {
    props: ["icon", "name", "disabled"],
    components: { BIcon, BIconDiscord, BIconGithub, BIconGoogle, BIconTriangleFill, BIconTwitter }
}
</script>