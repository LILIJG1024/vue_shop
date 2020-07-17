<template>
  <el-container class="home">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="flag?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu background-color="#114896" text-color="#fff" active-text-color="#ffd04b" :router="true" unique-opened :collapse="flag"
        :collapse-transition="false" :default-active="activePath">
          <!-- 1级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 2级菜单 -->
            <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="savename('/'+subItem.path)">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList:[],
      icons:{
        "125":"el-icon-user",
        "103":"el-icon-lock",
        "101":"el-icon-star",
        "102":"el-icon-font",
        "145":"el-icon-flag",
      },
      //是否折叠
      flag:false,
      activePath:""
    }
  },
  created() {
    this.getMenuList();
    this.activePath=window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res}=await this.$http.get("/menus");
      if(res.meta.status!==200)return this.$message.error(res.meta.msg)
      this.menuList=res.data
    },
    toggleCollapse(){
      this.flag=!this.flag
    },
    savename(activePath){
      window.sessionStorage.setItem("activePath",activePath);
      this.activePath=activePath;
    }
  }
};
</script>
<style lang="less" scoped>
.home {
  height: 100%;
}
.el-header {
  background-color: #abadcc;
  display: flex;
  justify-content: space-between;
  padding-left: 9px;
  align-items: center;
  color: rgb(180, 218, 44);
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 12px;
    }
  }
  img {
    height: 55px;
    width: 55px;
  }
}
.el-aside {
  background-color: #114896;
  .el-menu{
    border-right:none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #127956;
  font-size: 10px;
  line-height: 24px;
  color: aliceblue;
  cursor: pointer;
  letter-spacing: 0.2em;
  text-align: center;
}
</style>