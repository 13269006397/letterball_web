<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/image/dianzanmao.jpg" alt="" />
      </div>
      <!--登录表单区域 - 验证码登录-->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginInfo"
        :rules="loginRules"
        v-loading="LoginLoading"
      >
        <!--手机号-->
        <el-form-item prop="phoneNumber">
          <el-input
            v-model="loginInfo.phoneNumber"
            maxlength="11"
            prefix-icon="el-icon-mobile-phone"
          >
          </el-input>
        </el-form-item>
        <!--验证码输入框-->
        <el-form-item prop="vfCode">
          <el-input
            type="password"
            class="vf_input"
            maxlength="6"
            v-model="loginInfo.vfCode"
            prefix-icon="el-icon-lock"
          ></el-input>
          <!--验证码倒计时-->
          <el-button
            class="send_vfCode"
            type="success"
            plain
            @click="sendVfCode"
            v-if="!isDisabled"
            >{{ content }}</el-button
          >
          <el-button
            class="send_vfCode"
            type="success"
            plain
            v-if="isDisabled"
            >{{ content }}</el-button
          >
        </el-form-item>
        <!--按钮-->
        <el-form-item class="login_button">
          <el-button type="primary" round @click="userLogin">登录</el-button>
          <el-button type="info" round @click="resetLoginFrom">重置</el-button>
        </el-form-item>
        <el-form-item class="">
          社交账号登录
          <el-button
            class="other_login"
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            class="other_login"
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button
            class="other_login"
            type="warning"
            icon="el-icon-message"
            circle
          ></el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <span>© 2020 欣酋科技 · </span>
      <a style="text-decoration:none;" href="https://tsm.miit.gov.cn/dxxzsp/"
        >京 ICP 证 394309 号 ·
      </a>
      <a
        style="text-decoration:none;"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802020088"
      >
        <img
          alt=""
          src="https://pic3.zhimg.com/80/v2-d0289dc0a46fc5b15b3363ffa78cf6c7.png"
        />
        京公网安备 11010802010035 号 ·
      </a>
      <a
        style="text-decoration:none;"
        href="https://zhstatic.zhihu.com/assets/zhihu/publish-license.jpg"
      >
        出版物经营许可证
      </a>
    </div>
    <div class="footer2">
      <span
        >侵权举报 · 网上有害信息举报专区 · 儿童色情信息举报专区 ·
        违法和不良信息举报：010-82716601</span
      >
    </div>
  </div>
</template>
<script>
//引入api.js  好调用里面的接口
import { requestLogin } from "../api/api";
export default {
  name: "login",
  data() {
    return {
      isDisabled: false, //控制按钮是否可以点击（false:可以点击，true:不可点击）
      content: "获取短信验证码", // 发送验证码按钮的初始显示文字
      timer: null,
      count: "",
      model: {},
      LoginLoading: false,
      loginInfo: {
        phoneNumber: "",
        vfCode: ""
      },
      loginRules: {
        phoneNumber: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        vfCode: [
          {
            required: true,
            message: "请输入短信验证码",
            trigger: "blur"
          },
          { min: 6, max: 6, message: "请输入6位短信验证码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 发送验证码
    sendVfCode() {
      // 校验手机号
      if (this.loginInfo.phoneNumber == null) {
        this.$message("请输入手机号");
        return;
      }
      if (!/^1[34578]\d{9}$/.test(this.loginInfo.phoneNumber)) {
        this.$message("请输入正确的手机号");
        return;
      }
      // 发送验证码
      requestLogin(this.loginInfo).then(data => {
        this.isDisabled = false;
        if (data.code == "200") {
          this.$message("验证码发送成功");
        } else {
          this.$message({
            message: data.msg,
            type: "验证码发送失败"
          });
        }
      });
      // 控制倒计时及按钮是否可以点击
      const TIME_COUNT = 60;
      this.count = TIME_COUNT;
      this.timer = window.setInterval(() => {
        if (this.count > 0 && this.count <= TIME_COUNT) {
          // 倒计时时不可点击
          this.isDisabled = true;
          // 计时秒数
          this.count--;
          // 更新按钮的文字内容
          this.content = this.count + "s后重新获取";
        } else {
          // 倒计时完，可点击
          this.isDisabled = false;
          // 更新按钮文字内容
          this.content = "获取短信验证码";
          // 清空定时器!!!
          clearInterval(this.timer);
          this.timer = null;
        }
      }, 1000);
    },
    //重置表单
    resetLoginFrom() {
      this.$refs.loginFormRef.resetFields();
    },
    userLogin() {
      this.$refs.loginFormRef.validate(valid => {
        if (valid) {
          //验证通过 可以提交
          this.LoginLoading = true;
          //调用函数  传递参数 获取结果
          requestLogin(this.loginInfo).then(data => {
            if (data.code == "200") {
              this.LoginLoading = false;
              //登录成功
              sessionStorage.setItem("access-token", data.token);
              //用vue路由跳转到后台主界面
              this.$router.push({ path: "/home" });
            } else {
              this.LoginLoading = false;
              this.$message({
                message: data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background: url("../assets/image/login_bg.jpg") repeat;
  background-size: cover;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 400px;
  background-color: white;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 3px solid darkgray;
    border-radius: 50%;
    padding: 1px;
    box-shadow: 0 0 10px darkgray;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    img {
      width: 100%;
      border-radius: 50%;
      background-color: darkgray;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 40px 0 40px;
    box-sizing: border-box;
  }
  .vf_input {
    width: 52%;
  }
  .send_vfCode {
    margin-left: 35px;
  }
  .login_button {
    display: flex;
    justify-content: flex-end;
  }
  .other_login {
    margin-left: 10px;
  }
}
.footer {
  font-size: 12px;
  color: white;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -100%);

  a {
    color: white;
  }
}
.footer2 {
  font-size: 12px;
  color: white;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, -20%);
}
</style>
