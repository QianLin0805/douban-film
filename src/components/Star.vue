<template>
    <div class="stars" :style="[starsW,starH]">
        <p class="grey"><span v-for="i in 5" :style="[starW,starBg,starMl]"></span></p>
        <p class="color"><span v-for="i in parseInt(score)" :style="[starW,starBg,starMl]"></span><span :style="[starRate,starBg,starMl]"></span></p>
    </div>
</template>

<script>
export default {
    data(){
        return{
            starsW: {width: (this.size + this.size * this.gaprate) * 5 + 'rem'},
            starW: {width: this.size + 'rem'},
            starH: {height: this.size + 'rem'},
            starBg: {backgroundSize : this.size + 'rem'},
            starMl: {marginRight: this.size * this.gaprate + 'rem'},
            starRate: {width: (this.score - parseInt(this.score)) * this.size + 'rem' }
        }
    },
    props: {
        size : Number,
        gaprate : Number,
        score : Number
    }
}
</script>

<style lang="scss">
.stars{
    overflow: hidden; position: relative; font-size: 0;
    p{
        height: 100%;
        &.grey{
            span{background-image: url(../resource/img/star_g.png);}
        }
        &.color{
            position: absolute; left: 0; top: 0; z-index: 1; width: 100%;
            span{background-image: url(../resource/img/star_c.png);}
        }
        span{
            display: inline-block; height: 100%;
            background-repeat: repeat-x; background-position: left center;
            &:first-child{margin-left: 0;}            
        }
    }
}
</style>