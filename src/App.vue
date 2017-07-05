<template>
    <div id="app">
	    <h1>豆瓣电影榜单集合</h1>
	    <p class="sub-head">最新、最热的影视信息收集~</p>
        <ul class="nav">
	    	<li>
                <router-link class="hot" :to="{name:'list', query:{type:'in_theaters',title:'正在热映'}}"><i class="icon icon-fire"></i><span>正在热映</span><i class="icon-keyboard_arrow_right"></i></router-link>
    		</li>
	    	<li>
                <router-link class="coming" :to="{name:'list', query:{type:'coming_soon',title:'即将上映'}}"><i class="icon icon-clock"></i><span>即将上映</span><i class="icon-keyboard_arrow_right"></i></router-link>
    		</li>
	    	<li>
                <router-link class="top" :to="{name:'list', query:{type:'top250',title:'Top250'}}"><i class="icon icon-stats-bars"></i><span>Top250</span><i class="icon-keyboard_arrow_right"></i></router-link>
    		</li>
	    </ul>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'app'    
}
</script>

<style lang="scss">
@import './resource/css/icon.css';
body{background: #f5f5f5;}
#app {
    overflow: hidden; width: 100%; min-height: 100vh;
    h1{font-size: 1.8rem; color: #000; line-height: 3rem; margin: 3rem 20px 0;}
    .sub-head{font-size: 1.1rem; color: #999; line-height: 30px; margin: 0 20px;}
    .nav{
        overflow: hidden; font-size: 1.1rem; margin: 3.6rem 10px 0;
        li{
            height: 3.6rem; line-height: 3.6rem; margin-bottom: 10px;
            border: 1px solid #e8e8e8; border-radius: 5px; background: #fff;
            a{
                display: block; overflow: hidden; padding: 0 10px;
                &.hot{color: #e65050;}
                &.coming{color: #33d500;}
                &.top{color: #1abb99;}
                i{display: inline-block; font-size: 1.3rem; line-height: 3.6rem;}
                .icon{float: left; margin-right: 5px;}
                .icon-keyboard_arrow_right{float: right;color: #bbb;}
                span{float: left;}
            }
        }
    }
}
</style>
