<template>
  <div id="register-box">

    <div class="register-center-content-box">
      <div class="register-tips">
        <span class="register-text">注册</span>
      </div>
      <div class="center-box">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-position="right" label-width="100px">
              <el-form-item label="人类验证码">
                <el-input v-model="captchaCode" placeholder="请输入右侧验证码" @keyup.enter.native="doRegister"></el-input>
                <img
                  :src="captchaPath"
                  @click="updateVerifyCode"
                  class="captcha-code"/>
              </el-form-item>
              <el-form-item label="邮箱地址">
                <el-input v-model="hewieUser.email" placeholder="请输入邮箱地址"></el-input>
                <el-button v-if="!isCountingDown"  class="get-email-btn" type="primary" @click.prevent = "getVerifyCode">获取验证码</el-button>
                <el-button v-else type="primary" class="get-email-btn" disabled>{{ getVerifyCodeBtnText }}</el-button>
              </el-form-item>
              <el-form-item label="验证码">
                <el-input v-model="emailCode" placeholder="请输入邮箱验证码"></el-input>
              </el-form-item>
              <el-form-item label="用户名">
                <el-input v-model="hewieUser.userName" placeholder="独一无二的花名" @blur="checkUserName"></el-input>
                <span v-if="isUserNameOk === '1'" class="el-icon-error"> 该用户名已注册</span>
                <span v-if="isUserNameOk === '0'" class="el-icon-success"> 您的用户名也太棒了</span>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="originalPassword" placeholder="暗号"></el-input>
              </el-form-item>
              <el-form-item label-width="0px" class="register-center-content-button">
                <el-button type="primary" @click="doRegister" >注册</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
import {hex_md5} from "../../utils/md5";
export default {
  name: "index.vue",
  data() {
    return {
      originalPassword:'',
      hewieUser: {
        userName: '',
        password: '',
        email:'',
      },
      captchaCode:'',
      emailCode:'',
      captchaPath: '/user/captcha',
      isCountingDown:false,
      getVerifyCodeBtnText: '重新发送（60）',
      isUserNameOk: ''
    }
  },
  methods:{
    doRegister(){
      if (this.captchaCode === '') {
        this.$message.error('证明一下你的我的同类');
        return;
      }
      if (this.hewieUser.email === '') {
        this.$message.error('你忘了写邮箱地址么');
        return;
      }
      if (this.emailCode === '') {
        this.$message.error('您没有收到邮箱验证码吗？');
        return;
      }
      if (this.hewieUser.userName === '') {
        this.$message.error('怎么称呼您?');
        return;
      }
      if (this.originalPassword === '') {
        this.$message.error('少侠，没有暗号过不去！');
        return;
      }
      this.hewieUser.password = hex_md5(this.originalPassword);
      Api.registerUser(this.captchaCode, this.emailCode, this.hewieUser).then(result=>{
        if (result.code === 2002) {
          this.$message.success(result.message);
          location.href='/login'
        } else {
          this.$message.error(result.message);
          this.updateVerifyCode();
        }

      })
    },
    getVerifyCode(){
      if (this.captchaCode === '') {
        this.$message.error('人类验证码不能为空');
        return;
      }
      if (this.hewieUser.email === '') {
        this.$message.error('请输入邮箱地址');
        return;
      }
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.hewieUser.email)) {
        this.$message.error('邮箱格式不正确');
        return;
      }
      Api.sendEmailCode(this.captchaCode, this.hewieUser.email, 'register').then(result=>{
        if (result.code === Api.success_code) {
          this.startCountDown();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })

    },
    startCountDown() {
      let time = 60;
      this.isCountingDown = true;
      this.getVerifyCodeBtnText = '重新发送（60）';
      let that = this;
      let interval = setInterval(function (){
        time--;
        if (time <= 0) {
          that.isCountingDown = false;
          clearInterval(interval);
        }
        that.getVerifyCodeBtnText = '重新发送（' + time + '）';
      },1000);
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha?random = ' + Date.parse(new Date());
      //console.log(this.captchaPath);
    },
    checkUserName(){
      if (this.hewieUser.userName.trim() === '') {
        this.isUserNameOk = '';
        return
      }
      Api.checkUserName(this.hewieUser.userName).then(result=>{
        if (result.code === Api.success_code) {
          this.isUserNameOk = '1';
        } else {
          this.isUserNameOk = '0';
        }
      })
    }
  },
  mounted() {
    this.updateVerifyCode();
    this.$store.commit("setCurrentActivityTab", "index");
  },
  head() {
    return {
      titleTemplate: '幸运两小只-注册中心',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，用户注册中心' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
}
</script>

<style>
.center-box .el-icon-success {
  color: #67c23a;
}
.center-box .el-icon-error {
  color: #f56c6c;
}
.qr-code .el-image__error{
  width: 250px;
  height: 160px;
  text-align: center;
}
#qr-code-refresh span{
  line-height: 160px;
  width: 160px;
  height: 160px;
  display: inline-block;
  cursor: pointer;
  background: #dcdfe6;
  color: #93999f;
}

#qr-code-refresh{
  width: 250px;
  height: 160px;
  text-align: center;
}

.center-qr-code{
  width: 250px;
  height: 200px;
  text-align: center;
}
.qr-code , .qr-code-refresh{
  margin-bottom: 20px;
}
.qr-code img{
  width: 160px;
  height: 160px;
}
.center-qr-code .scan-tips{
  color: #93999f;
}
.register-type{
  font-size: 14px;
  margin-left: 20px;
  font-weight: 400;
  cursor: pointer;
}

.register-tips{
  display: inline-block;
  padding: 10px 0;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 20px;
  color: #93999f;
  width: 100%;
}
.forget-btn{
  margin-left: 20px;
  color: #93999f;
}
.forget-btn:hover{
  color: #3377ff;
}
#register-box{
  width: 1140px;
  margin: 0 auto;
}
.captcha-code {
  cursor: pointer;
  width: 120px;
  height: 42px;
  vertical-align: middle !important;
  margin-left: 10px;
}


.register-center-content-button {
  margin-bottom: 0px;
  border-left-width: unset;
}
.register-center-content-button .el-form-item__content {
  margin-left: 200px;
}

.register-center-content-box {
  width: 1140px;
  background: #fff ;
  box-shadow: 0 1px 10px #afafaf;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}
.register-center-content-box .el-input {
  width: 50%;
}

.register-center-content-box .el-form-item__label {
  background: #f9fafb;
  text-align: center;
  border-top: #dcdfe6 solid 1px;
  border-left: #dcdfe6 solid 1px;
  border-bottom: #dcdfe6 solid 1px;
}

.register-center-content-box .el-input__inner {
  border-radius: unset;
  border: #dcdfe6 solid 1px;
  height: 42px;
}

.register-center-content-box .el-input__inner:hover {
  border: #c0c4cc solid 1px;
}
.center-box .get-email-btn{
  margin-left: 16px;
  height: 42px
}


</style>
