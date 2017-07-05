<template>
    <div class="detail">
        <div class="mask" v-show="maskFlag">
            <img src="../resource/img/loading.gif" alt="" v-if="!loadFaild" >
            <img src="../resource/img/faild.jpg" alt="" v-if="loadFaild" >
            <br>
            <span>{{loadtip}}</span>
        </div>
	    <header v-if="datas" :style="{background:headerBg}" ref="header"><i @click="back" class="icon-arrow_left"></i><span v-once>{{datas.title}}</span></header>
        <div class="main" v-if="datas" ref="main">
            <div class="scroller">
                <p class="post" :style="{background:imgColor}" ref="postwrap"><img :src="datas.images.large" alt="" ref="post"></p>
                <div class="info mode">
                    <div class="score">豆瓣评分：<v-star :size="1" :gaprate="0.2" :score="datas.rating.average/2"></v-star>{{datas.rating.average}}分<span class="count">{{datas.ratings_count}}人评分</span></div>
                    <p>类型：{{datas.genres.join(' / ')}}</p>
                    <p>原名：{{datas.original_title}}</p>
                    <p>上映年份：{{datas.year}}年({{datas.countries.join(' / ')}})</p>
                </div>
                <div class="summary mode">
                    <h3>剧情简介</h3>
                    <p>{{datas.summary}}</p>
                </div>
                <div class="casts mode">
                    <h3>影人</h3>
                    <div class="wrap">
                        <div class="scroller">
                            <ul>
                                <li></li>
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
            ajaxFlag : false,
            link : 'https://api.douban.com/v2/movie/subject/' + this.$route.query.id,
            datas : '',
            imgColor : '',
            headerBg : '',
            loadFaild : false,
            loadtip : '正在加载，请稍后~',
            scroll : ''
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
                        scrollY : true,                               //可滚动方向
                        bounceTime : 900,                             //弹力动画持续时间，即滚动手感
                        probeType : 3
                    });
                    this.scroll.on('scroll', () => {
                        if(-this.scroll.y >= this.$refs.postwrap.clientHeight - this.$refs.header.clientHeight){
                            this.headerBg = this.imgColor;
                        }else{
                            this.headerBg = this.imgColor.split('(').join('a(').split(')').join(',0.2)');
                        }
                    });
                    RGBaster.colors(this.$refs.post, {
                        paletteSize : 30,                  //调色板个数
                        exclude : ['rgb(255,255,255)','rgb(0,0,0)'],
                        success : (result) => {
                            //console.log(result.dominant)   //主色
                            //console.log(result.secondary)  //次色
                            this.imgColor = result.dominant.split('(').join('a(').split(')').join(',0.9)');
                            this.headerBg = result.dominant.split('(').join('a(').split(')').join(',0.2)');
                        }
                    })
                });
            }
        });
    },
    methods: {        
        back(){
            if(this.ajaxFlag) return;
            window.history.back();
        }
    },
    watch: {
        imgColor(val){
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
        color: #fff; border: none;
    }
    .main{
        overflow: hidden; height: 100%;
        .post{
            text-align: center; height: 16rem; padding: 4.5rem 0 1.5rem; background: #333;
            img{height: 100%;}
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
        .summary p{font-size: 1rem; color: #333; line-height: 1.6rem;}
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
