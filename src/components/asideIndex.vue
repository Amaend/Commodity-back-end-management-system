<template>
    <div class="menu">
        <el-aside :width="isCollapse ? '60px' : '200px'">
            <div class="toggle-button" @click="toggleCollapse">
                <i class="iconfont icon-caidan"></i>
            </div>
            <el-menu :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.fullPath"
                unique-opened>
                <!-- 一级菜单 -->
                <el-submenu v-for="(item, index) in menusData" :index="item.id + ''" :key="item.id">
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="`${iconList[index]}`" class="iconfont"></i>
                        <!-- 文本 -->
                        <span>{{ item.authName }}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <template slot="title"></template>
                    <el-menu-item :index="'/home/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
                        <i class="el-icon-menu"></i>
                        <span>{{ subitem.authName }}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
            isCollapse: true,
            iconList: ['icon-yonghuguanli', 'icon-zhanghaoquanxianguanli', 'icon-shangpinguanli', 'icon-dingdanguanli', 'icon-shujutongji'],
        };
    },
    methods: {
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
    },
    created() {
        this.$store.dispatch('getMenusdata')
    },
    computed: {
        ...mapState({
            menusData: (state) => {
                return state.menus.menusData;
            }
        })
    },

}
</script>

<style scoped>
.el-aside {
    height: 100vh;
    background-color: #fff;
    overflow: hidden;
    transition: .5s;
}

.toggle-button {
    display: block;
    position: relative;
    top: 0;
    left: 0;
    height: 56px;
    line-height: 56px;
    width: auto;
    box-sizing: border-box;
    padding: 0px 20px;
    background-color: #fff;
    border: 0;
}

.toggle-button .iconfont {
    display: block;
    width: 24px;
    font-size: 14px;
}

/* 
.el-menu-item.is-active {
    color: #909399;
} */

.el-submenu__icon-arrow {
    position: absolute;
    top: 50%;
    right: 20px;
    margin-top: -7px;
    /* transition: transform .3s; */
    font-size: 12px;
}

.el-menu-vertical-demo {
    transition: width 1s;
}

.iconfont {
    font-size: 20px;
    font-weight: 400;
    color: #000 !important;
    text-align: center;
}

.el-submenu__title>span {
    margin-left: 10px;
}
</style>