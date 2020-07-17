<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 上方内容 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 输入框 -->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>

        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="success" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" border stripe>
        <!-- 基本信息区域 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>

        <!-- 状态区域 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row.mg_state}} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="userStatusChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>

        <!-- 操作区域 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,3,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
      <!-- 主体区域 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="ruleForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证规则
    var checkemail=(rule,value,callback)=>{
      const reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if(reg.test(value)){
        return callback();
      }
      callback(new Error("请输入合法的邮箱"))
    }
    var checkmobile=(rule,value,callback)=>{
       const reg1=/^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
      if(reg1.test(value)){
        return callback();
      }
      callback(new Error("请输入合法的手机号"))
    }
    return {
      //获取用户列表参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [
        {
          username: "zs",
          email: "zs@qq.com",
          mobile: 123456,
          role_name: "超级管理员",
          mg_state: true
        }
      ],
      total: 5,
      dialogVisible: false,
      addForm:{
        username:"",
        password:"",
        email:"",
        mobile:""
      },
      rules:{
        username:[
          {required:true,message:"请输入用户名",trigger:"blur"},
          {min:2,max:16,message:"用户名要在2~16字符之间",trigger:"blur"}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:"blur"},
          {min:6,max:16,message:"密码要在6~16字符之间",trigger:"blur"}
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:"blur"},
          {validator:checkemail,trigger:"blur"}
        ],
        mobile:[
          {required:true,message:"请输入手机号",trigger:"blur"},
          {validator:checkmobile,trigger:"blur"}
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.meta.users;
      this.total = res.meta.total;
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      getUserList();
    },
    async userStatusChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`,
        {}
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新用户列表失败");
      }
      this.$message.success("更新成功");
    }
  }
};
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
</style>