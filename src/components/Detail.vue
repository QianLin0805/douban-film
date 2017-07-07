<template>
    <div class="detail">
        <div class="mask" v-show="maskFlag">
            <img src="../resource/img/loading.gif" alt="" v-if="!loadFaild" >
            <img src="../resource/img/faild.jpg" alt="" v-if="loadFaild" >
            <br>
            <span>{{loadtip}}</span>
        </div>
	    <header v-if="datas" ref="header" :class="{bgHeader:bgFlag}">
            <p v-show="bgFlag" :style="{background:imgColor}"></p>
            <i @click="back" class="icon-arrow_left"></i><span v-once>{{datas.title}}</span>
        </header>
        <div class="main" v-if="datas" ref="main">
            <div class="scroller">
                <div class="post" ref="postwrap">
                    <p class="bg" :style="{background:imgColor}"></p>
                    <img :src="datas.images.large" alt="" ref="post">
                </div>
                <div class="info mode">
                    <div class="score">豆瓣评分：<v-star :size="1" :gaprate="0.2" :score="datas.rating.average/2"></v-star>{{datas.rating.average}}分<span class="count">{{datas.ratings_count}}人评分</span></div>
                    <p>类型：{{datas.genres.join(' / ')}}</p>
                    <p>原名：{{datas.original_title}}</p>
                    <p>上映年份：{{datas.year}}年({{datas.countries.join(' / ')}})</p>
                </div>
                <div class="summary mode">
                    <h3>剧情简介</h3>
                    <p :class="{hide:summaryFlag}">{{datas.summary}}</p>
                    <span class="toggle" @click="toggle">展开</span>
                </div>
                <div class="casts mode">
                    <h3>影人</h3>
                    <div class="wrap" ref="casts">
                        <div class="scroller" :style="{width : castsWidth + 'px'}">
                            <ul>
                                <li v-for="item in casts">
                                    <img :src="item.avatars.small" alt="">
                                    <p class="name">{{item.name}}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="photos mode">
                    <h3>剧照</h3>
                    <div class="wrap">
                        <div class="scroller">
                            <ul>
                                <li></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="ratings mode">
                    <div class="tab"><p class="active">短评</p><p>长评</p></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import star from './Star'
import Bscroll from 'better-scroll'

export default {
    data(){
        return {
            maskFlag : true,
            summaryFlag : true,
            bgFlag : false,
            link : 'https://api.douban.com/v2/movie/subject/' + this.$route.query.id,
            datas : '',
            imgColor : '',
            loadFaild : false,
            loadtip : '正在加载，请稍后~',
            scroll : '',
            castScroll : '',
            photoScroll : ''
        }
    },
    created(){
        this.$ajax(this.link, null, (err, res) => {
            if(err){
                this.loadtip = '数据请求失败';
            }else{
                this.datas = res;
                this.maskFlag = false;

                this.$nextTick(function(){
                    this.scroll = new Bscroll(this.$refs.main, {
                        click : true,
                        scrollY : true,                               //可滚动方向
                        bounceTime : 900,                             //弹力动画持续时间，即滚动手感
                        probeType : 3
                    });
                    RGBaster.colors(this.$refs.post, {                //获取图片主色
                        paletteSize : 30,                             //调色板个数
                        exclude : ['rgb(255,255,255)','rgb(0,0,0)'],
                        success : (result) => {
                            //console.log(result.dominant)   //主色
                            //console.log(result.secondary)  //次色
                            this.imgColor = result.dominant.split('(').join('a(').split(')').join(',0.45)');
                        }
                    });
                    this.scroll.on('scroll', () => {
                        if(this.$refs.header && -this.scroll.y >= this.$refs.postwrap.clientHeight - this.$refs.header.clientHeight){
                            this.bgFlag = true;
                        }else{
                            this.bgFlag = false;
                        }
                    });
                });
            }
        });
    },
    computed: {
        casts(){
            if(!this.datas) return;
            let arr = [];
            for(let i=0;i<this.datas.directors.length;i++){
                arr.push(this.datas.directors[i]);
            }
            for(let i=0;i<this.datas.casts.length;i++){
                arr.push(this.datas.casts[i]);
            }
            return arr;
        },
        castsWidth(){
            if(!this.casts) return;
            return this.casts.length * 60 + (this.casts.length - 1) * 5;
        }
    },
    methods: {
        back(){
            if(this.ajaxFlag) return;
            window.history.back();
        },
        initScroll(obj,el){
            let params = {
                scrollX : true,                               //可滚动方向
                bounceTime : 900,                             //弹力动画持续时间，即滚动手感
                probeType : 3
            }
            obj = new Bscroll(el, params);
        },
        toggle(e){
            this.summaryFlag = false;
            e.target.remove();
            this.$nextTick(function(){
                this.scroll.refresh();
            })
        }
    },
    watch: {
        castsWidth(val,oldVal){
            if(this.castScroll) return;
            this.$nextTick(function(){
                this.initScroll(this.castScroll, this.$refs.casts);
            });
        }
    },
    components: {
        'v-star' : star
    }
}
</script>

<style lang="scss">
.detail{
    z-index: 333;
    header{
        position: absolute; left: 0; top: 0;
        color: #fff; border: none; background: none;
        &.bgHeader{background: #666;}
        p{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}
    }
    .main{
        overflow: hidden; height: 100%;
        .post{
            position: relative; text-align: center; height: 16rem; padding: 4.5rem 0 1.5rem; background: #666;
            p{position: absolute; left: 0; top: 0; width: 100%; height: 100%;}
            img{position: relative; z-index: 1;height: 100%;}
        }
        .mode{
            padding-top: 1rem;
            h3{font-size: 12px; color: #999; line-height: 2rem;}
            &.info,&.summary{ margin: 0 10px;}
            &.casts,&.photos{ margin-left: 10px;}
        }
        .info{
            overflow: hidden; font-size: 12px; color: #666; line-height: 1.6rem;
            padding-bottom: 1rem; margin: 0 10px; border-bottom: 1px solid #ddd;
            .score{
                .stars{display: inline-block; vertical-align: middle; margin: -5px 3px 0 0;}
                .count{color: #999; margin-left: 10px}
            }
        }
        .summary{
            overflow: hidden;
            p{
                font-size: 1rem; color: #333; line-height: 1.6rem;
                &.hide{display:  -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 4; overflow: hidden;}
            }
            span{float: right; font-size: 1.05rem; color: #690; line-height: 2.4rem; padding-left: 10px;}
        }
        .casts ul{
            overflow: hidden; width: 100%; height: 110px;
            li{
                float: left; width: 60px; height: 100%; margin-left: 5px;
                &:first-child{margin-left: 0;}
                img{width: 60px;}
                p{overflow: hidden; font-size: 12px; color: #555; text-align: center; width: 100%; line-height: 24px; text-overflow: ellipsis; white-space: nowrap;}
            }
        }
        .ratings{
            overflow: hidden;
            .tab{
                font-size: 1rem; color: #555; text-align: center; height: 2.5rem; line-height: 2.5rem;
                p{
                    float: left; position: relative; width: 50%; background: #e5e5e5;
                    &.active{&:after{
                        content: ''; position: absolute; left: 0; bottom: 0;
                        width: 100%; height: 2px; background: #666;
                    }}
                }
            }
        }
    }
}
</style>
