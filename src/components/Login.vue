<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="reset" class="form" :model="form" :rules="loginRules">
        <!-- 用户名 -->
        <el-form-item prop="uname">
          <el-input prefix-icon="el-icon-user" v-model="form.uname"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" v-model="form.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
            <el-button type="success" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data() {
      return {
        //登入表单的数据对象
        form:{
          uname:"",
          password:""
        },
        //表单验证规则对象
        loginRules:{
          uname:[
             { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 16, message: '长度在2 到 16 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在6 到 16 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetForm(){
        this.$refs.reset.resetFields();
      },
      login(){
        this.$refs.reset.validate(async function(valid){
          if(!valid){
            return
          }else{
           const {data:res}=  await this.$http.post("login",this.form)
           if(res.meta.status!==200){
             return this.$message.error("登录失败")
           }else{
             return this.$message.success("登录成功")
           }
          }
          //1.将登录成功之后的token保存在客户端的sessionStorage中
          // 1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
          // 1.2 token只应该在当前网站打开期间生效，所以将token保存在sessionStorage中
          window.sessionStorage.setItem("token",res.data.token);
          //2.通过编程式导航跳转道后台主页
          this.$router.push("/home")
        });
      }
    },
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius:3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%,-50%);

        .avatar_box{
          height: 130px;
          width:130px;
          border-radius:50% ;
          border: 1px solid #eee;
          padding: 10px;
          box-shadow: 0 0 10px #ddd;
          position: absolute;
          left: 50%;
          transform:translate(-50%,-50%);
          background: #fff;
          img{
            width: 100%;
            height: 100%;
            border-radius:50% ;
            background-color: #eee;
          }
        }
    }
    .btns{
      display: flex;
      justify-content: flex-end;
    }
    .form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      // 将content-box修改为border-box
      box-sizing: border-box;
    }
</style>

