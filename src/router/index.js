import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
    mode : 'history',
    routes: [
        {
            path : '/',
            name : 'index'
        },
        {
            path : '/list',
            name : 'list',
            component : List,
            children : [
                {
                    path : '/detail',
                    name : 'detail',
                    component : Detail
                }
            ]
        },
        {
            path : '*',
            redirect : {name : 'index'}
        }
    ]
})
