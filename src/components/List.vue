<template>
    <div class="list">
        <div class="mask" v-show="maskFlag">
            <img src="../resource/img/loading.gif" alt="" v-if="!loadFaild" >
            <img src="../resource/img/faild.jpg" alt="" v-if="loadFaild" >
            <br>
            <span>{{loadtip}}</span>
        </div>
	    <header><i @click="back" class="icon-arrow_left"></i><span v-once>{{title}}</span></header>
        <div class="listwrap" ref="wrap">
            <div class="scroller">
			    <ul>
			        <li v-for="item in list">
                        <router-link :to="{name:'detail', query:{id:item.id}}">
                            <img :src="item.images.small" class="avatar" >
                            <p class="title" v-text="item.title"></p>
                            <p class="info">
                                <span class="year" v-text="item.year"></span>
                                <span class="genre">{{item.genres.join('，')}}</span>
                            </p>
                            <p class="directors" v-formatName="item.directors">导演：</p>
                            <p class="actors" v-formatName="item.casts">主演：</p>
                            <span class="score">{{item.rating.average}} 分</span>
                        </router-link>
                    </li>
			    </ul>
	    		<p class="loadMore">{{loadtip}}</p>
            </div>
        </div>
        <transition name="slide">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'

export default {
    data(){
        return {
            maskFlag : true,
            ajaxFlag : false,
            list : [],
            begin : 0,
            limit : 8,
            loadFaild : false,
            loadtip : '正在加载，请稍后~',
            loadOver : false,
            scroll : ''
        }
    },
    created(){
        if(this.$route.query.type){
            localStorage.type = this.$route.query.type;
            localStorage.title = this.$route.query.title;
        }
        this.getData();
    },
    computed: {
        title(){
            if(this.$route.query.type){
                return this.$route.query.title;
            }else{
                return localStorage.title;
            }
        },
        link(){
            if(this.$route.query.type){
                return 'https://api.douban.com/v2/movie/' + this.$route.query.type + '?start=' + this.begin + '&count=' + this.limit;
            }else{
                return 'https://api.douban.com/v2/movie/' + localStorage.type + '?start=' + this.begin + '&count=' + this.limit;
            }
        }
    },
    directives : {                                               //自定义指令
        formatName : {
            bind : function (el,arr){
                var text = el.innerText;
                let property = [];
                for(let i=0;i<arr.value.length;i++){
                    property.push(arr.value[i].name);
                }
                el.innerText = text + property.join('，');
            }
        }
    },
    methods: {
        getData(){
            if(this.ajaxFlag) return;
            this.ajaxFlag = true;

            this.$ajax(this.link, null, (err, res) => {
                if(err){
                    if(this.begin == 0) this.loadFaild = true;
                    this.loadtip = '数据请求失败';
                }else{
                    res.subjects.forEach((subject) => {
                        this.list.push(subject);
                    });
                    this.maskFlag = false;
                    this.begin += res.subjects.length;
                    if(this.begin >= res.total){
                        this.loadtip = '已全部加载';
                        this.loadOver = true;
                    }

                    this.$nextTick(function(){
                        if(!this.scroll){
                            this.scroll = new Bscroll(this.$refs.wrap, {
                                click : true,
                                scrollY : true,                               //可滚动方向
                                bounceTime : 900,                             //弹力动画持续时间，即滚动手感
                                probeType : 3
                            });
                            this.scroll.on('scroll', () => {
                                if(this.loadOver) return;
                                if(-this.scroll.y >= -this.scroll.maxScrollY-100 && this.scroll.directionY == 1){
                                    this.getData();
                                }
                            });
                        }else{
                            this.scroll.refresh();
                        }
                    });
                }
                this.ajaxFlag = false;
            });
        },
        back(){
            if(this.ajaxFlag) return;
            window.history.back();
        }
    }
}
</script>

<style lang="scss">
.list,.detail{
    position: absolute; left: 0; top: 0; overflow: hidden;
    width: 100%; height: 100%; background: #f5f5f5;
    transition: all 0.3s ease-in;
    &.slide-enter,&.slide-leave-active{transform: translate3d(100%,0,0);}
    .mask{
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        position: absolute; left: 0; top: 0; z-index: 11; overflow: hidden;
        width: 100%; height: 100%; line-height: 12px; background: #eee;
        img{width: 60%; margin: -25% 0 0 6%;}
    }
    header{
        position: absolute; left: 0; top: 0; z-index: 111;
        color: #999; font-size: 1.1rem; text-align: center; width: 100%; height: 3rem; line-height: 3rem;
        border-bottom: 1px solid #ddd; background: white;
        i{
            display: inline-block; position: absolute; left: 0.5rem; top: 0; z-index: 1;
            width: 2rem; height: 3rem; line-height: 3rem;
        }
        span{position: relative; z-index: 1;}
    }
}
.list{
    z-index: 1;
    .listwrap{
        position: absolute; left: 0; top: 3rem; bottom: 0; width: 100%; margin-top: 1px;
        ul{
            overflow: hidden;
            li{
                overflow: hidden; margin-top: 10px; background: white;
                a{
                    display: block; position: relative; min-height: 7.7rem; padding: 10px 10px 10px calc(5rem + 20px);
                    .avatar{position: absolute; left: 10px; top: 1rem; width: 5rem;}
                    p{font-size: 12px;}
                    .title{font-size: 1.15rem; font-weight: bold; line-height: 2.4rem;}
                    .info{
                        color: #999; line-height: 1.2rem;
                        .year{margin-right: 5px;}
                    }
                    .directors{color: #666; line-height: 1.6rem; margin-top: 10px;}
                    .actors{color: #666; line-height: 1.6rem;}
                    .score{position: absolute; right: 10px; top: 3rem; font-size: 12px; line-height: 16px; color: #e64340;}
                }
            }
        }
        .loadMore{font-size: 12px; text-align: center; color: #bbb; height: 2.4rem; line-height: 2.4rem;}
    }
}
@media ( min-width : 640px) {
	.list,.detail{width: 640px; left: 50%; margin-left: -320px;}
}
</style>
