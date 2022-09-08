<template>
    <el-container>
        <el-aside width="240px">
            <el-menu router default-active="2" class="el-menu-vertical-demo" background-color="#545c64"
                text-color="#fff" active-text-color="#ffd04b">
                <GAsideMenu v-for="(item, i) in menus" :key="i" :item="item" />
            </el-menu>
        </el-aside>
        <el-container>
            <el-header>
                <div class="left">
                    <GBreadcrumb />
                </div>
                <div class="right">
                    <GDropdown @command="doCommand" :title="'admin'" :items="[{ key: 'logout', label: '退出' }]" />
                </div>
            </el-header>
            <el-main>

                <div class="tags-box">
                    <el-tag @click="$router.push({ name:t.compName })"  @close="delTag(t)" closable v-for="(t, i) in tags" :key="i">{{t.title}}</el-tag>
                </div>



                <!-- 完全避免了组件的创建与销毁: 组件常驻内存 -->
                <transition name="fade" mode="out-in">
                    <keep-alive :max="40" :include="getTagsCompName">
                        <router-view />
                    </keep-alive>
                </transition>
            </el-main>
            <el-footer>Footer</el-footer>
        </el-container>
    </el-container>

</template> 

<script>
import { mapGetters, mapActions,mapMutations } from 'vuex'
import GAsideMenu from '../components/GAsideMenu.vue'
import GDropdown from '../components/GDropdown.vue'

export default {
    components: {GAsideMenu,GDropdown},
    methods: {
        ...mapMutations({
            delTag:'user/delTag'
        }),
        ...mapActions({
            doLogout: 'user/doLogout',
        }),
        async doCommand(e) {
            if (e === 'logout') {
                await this.doLogout();
                // 外部没有依赖里面的值
                // 依赖的是执行顺序
                window.location.reload();
            }
        }
    },
    computed: {
        ...mapGetters({
            menus: 'user/getUserMenus',
            tags: 'user/getTags'
        }),
        getTagsCompName(){
            return this.tags.map(e=>e.compName)
        }
    },
    name: 'Layout'
}
</script>

<style scoped>
.el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
}

.el-container {
    height: 100%;
}

.el-menu-vertical-demo {
    border: none;
}

.tags-box {
    margin-bottom: 10px;
    text-align: left;
}
.el-tag {
    cursor:pointer;
    margin-right:4px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>