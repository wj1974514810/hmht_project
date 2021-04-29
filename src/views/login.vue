<template>
  <div class="login">
    <div class="container">
      <img src="../assets/avatar.jpg" class="avatar" />
      <!-- model 表单的数据绑定 rules是验证规则，不写就没有验证  -->
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="demo-ruleForm"
      >
        <!-- prop 指定验证规则的名称  定义的是username  就写username-->
        <!--  prefix-icon是在输入框的前面加上图标 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
            placeholder="请输入11位手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-key"
            v-model="loginForm.password"
            placeholder="请输入3-16位的密码"
          ></el-input>
        </el-form-item>
        <el-button type="primary" class="login-btn" @click="login"
          >登陆</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import { userLogin } from "@/apis/user.js";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          // trigger失焦  required 是必须输入
          //   pattern 是表单中的正则验证
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "长度在11位,且第一位是1",
            trigger: "blur",
          },
        ],
        password: [
          {
            pattern: /^.{3,16}$/,
            required: true,
            message: "请输入3-16位密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      // 表单验证 验证通过发请求，不通过不发请求
      // 表单的validate函数 验证之前写的规则，里面有valid参数，如果之前的规则验证通过，valid为true，然后再去发请求，否则valid为false，不会发送请求
      this.$refs.loginForm.validate(async (valid) => {
        console.log(valid);
        if (valid) {
          let res = await userLogin(this.loginForm);
          console.log(res);
          if (res.data.message == "登录成功") {
            //   第一种提示方式里面的第一种 直接调用
            this.$message.success(res.data.message);
            localStorage.setItem("hmtt_ht_token", res.data.data.token);
            localStorage.setItem("user_id", res.data.data.user.id);
            this.$router.push({ name: "index" });
          } else {
            //   第一种提示方式里面的第二种，一个对象
            this.$message({
              message: "登录失败！",
              type: "warning",
            });
          }
        } else {
          this.$message.warning("数据输入不合法");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>