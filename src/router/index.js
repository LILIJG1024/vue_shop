import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from "../components/Home.vue"
import Welcome from "../components/Welcome.vue"
import User from "../components/user/User.vue"
import Rights from "../components/power/rights.vue"
import Roles from "../components/power/roles.vue"

Vue.use(VueRouter)

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
        path: "/home",
        component: Home,
        redirect: "/welcome",
        children: [
            { path: "/welcome", component: Welcome },
            { path: "/users", component: User },
            { path: "/rights", component: Rights },
            { path: "/roles", component: Roles }
        ]
    },
]

const router = new VueRouter({
    routes
})

// router.beforeEach((to, from, next) => {
//     //to表示将要访问的路径
//     //from代表从哪个路径跳转而来
//     //next是一个函数表示放行
//     if (to.path === "/login") {
//         return next();
//     } else {
//         const tokenStr = window.sessionStorage.getItem("token")
//         if (!tokenStr) {
//             return next("/login")
//         } else {
//             next();
//         }
//     }
// })

export default router