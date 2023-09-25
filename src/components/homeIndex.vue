<template>
    <div class="home">
        <el-container>
            <div class="aside-conatiner">
                <asideIndex></asideIndex>
            </div>
            <el-container>
                <el-header>
                    <div class="header-cotainer">
                        <div class="header-title">
                            <h2>元神糕手的管理系统</h2>
                            <div class="user">
                                <el-dropdown :hide-on-click="false">
                                    <span class="el-dropdown-link">{{ usreName }}</span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>个人中心</el-dropdown-item>
                                        <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </div>
                    </div>
                </el-header>
                <el-main>
                    <div class="bread">
                        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="!breadData.length">
                            <el-breadcrumb-item @click.native="goHome">Home</el-breadcrumb-item>
                            <el-breadcrumb-item></el-breadcrumb-item>
                        </el-breadcrumb>
                        <el-breadcrumb separator-class="el-icon-arrow-right" v-for="item in breadData" :key="item.id">
                            <el-breadcrumb-item @click.native="goHome">Home</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ item.name }}</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ item.itemname }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import asideIndex from '@/components/asideIndex.vue'
import { mapState } from 'vuex';
export default {
    data() {
        return {
            usreName: '',
            breadData: []
        }
    },
    components: {
        asideIndex,
    },
    methods: {
        loginOut() {
            window.sessionStorage.clear('token')
            this.$router.push('/login')
        },
        goHome() {
            if (this.$route.path == '/home') {
                return
            }
            this.$router.push('/home')
        }
    },
    watch: {
        $route(newdata, olddata) {
            this.breadData.shift()
            let route = newdata.fullPath.split('/')[2]
            if (route) {
                this.menusData.forEach((item) => {
                    item.children.forEach((itemchild) => {
                        if (itemchild.path == route) {
                            this.breadData.push({ name: item.authName, itemname: itemchild.authName })
                            window.sessionStorage.setItem('name', item.authName)
                            window.sessionStorage.setItem('itemname', itemchild.authName)
                        }
                    })
                })
            }
        },
    },
    computed: {
        ...mapState({
            menusData: (state) => {
                return state.menus.menusData;
            }
        })
    },
    mounted() {
        this.usreName = window.sessionStorage.getItem('username')
        if (this.$route.fullPath == '/home' || this.$route.fullPath == ' /home/animated') return
        this.breadData.push({ name: sessionStorage.getItem('name'), itemname: sessionStorage.getItem('itemname') })
    },

}
</script>

<style scoped>
.el-header {
    background-color: #eaeaea;
    height: 56px !important;
}

.el-main {
    background-color: #ffffff;
}

.header-title>h2 {
    float: left;
    line-height: 56px;
    font-family: 宋体;
}

.user {
    float: right;
}

.username {
    font-size: 16px;
    color: #666;
    line-height: 56px;
    cursor: pointer;
}

.el-dropdown-link {
    text-align: center;
    font-size: 16px;
    line-height: 56px;
}
</style>