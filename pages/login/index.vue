<template>
  <div id="login-box">

    <div class="login-center-content-box">
      <div class="login-tips">
        <span class="login-text">登录</span>
        <span class="login-type" @click="doChooseLoginType('0')">账号登录</span>
        <span class="login-type" @click="doChooseLoginType('1')">扫码登录</span>
      </div>
      <div v-if="loginType === '1'" class="center-qr-code">
        <div class="qr-code" id="qr-code">
          <el-image ref="loginQrCode"  @error="onQrCodeLoadError" :src="qrCodeImg"></el-image>
        </div>
        <div class="qr-code-refresh" id="qr-code-refresh" @click="refreshQrCode" style="display: none">
          <span><i class="el-icon-refresh"></i>点击刷新二维码</span>
        </div>
        <div class="scan-tips">请打开客户端App进行扫码登录</div>
      </div>
      <div v-if="loginType === '0'" class="center-box">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-position="right" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="hewieUser.userName" placeholder="用户名/邮箱"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="originalPassword" placeholder="密码"></el-input>
              </el-form-item>
              <el-form-item label="人类验证码">
                <el-input v-model="loginInfo.verifyCode" placeholder="请输入右侧验证码" @keyup.enter.native="doLogin"></el-input>
                <img
                  :src="captchaPath"
                  @click="updateVerifyCode"
                  class="captcha-code"/>
              </el-form-item>
              <el-form-item label-width="0px" class="login-center-content-button">
                <el-button type="primary" @click="doLogin" >登录</el-button>
                <a class="forget-btn" href="/forget">
                  <span>忘记密码？</span>
                </a>
                <a class="forget-btn" href="/register">
                  <span>还没有用户名？</span>
                </a>
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
  head() {
    return {
      titleTemplate: '幸运两小只-登录',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，用户登录中心' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  name: "index.vue",
  asyncData(){
    return {
      loginInfo: {
        verifyCode: '',
        from: 'p_',
      },
      captchaPath: '/user/captcha',
    }
  },
  mounted() {
    this.updateVerifyCode();
    this.$store.commit("setCurrentActivityTab", "index");
  },
  data() {
    return {
      hewieUser: {
        userName: '',
        password: '',
      },
      loginType:'0',
      qrCodeLoginKey:'',
      qrCodeImg:'',
      isCommitting:false,
      isScanStateChecking: false,
      originalPassword:''
    }
  },
  methods:{
    refreshQrCode(){
      this.getLoginQrCode();
    },
    onQrCodeLoadError(){
      let qrCodeBox = document.getElementById('qr-code');
      if (qrCodeBox) {
        qrCodeBox.style.display = 'none'
      }
      let codeRefresh = document.getElementById('qr-code-refresh');
      if (codeRefresh) {
        codeRefresh.style.display = 'block'
      }
      this.qrCodeLoginKey = '';
      this.qrCodeImg = ''
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha?random = ' + Date.parse(new Date());
      //console.log(this.captchaPath);
    },
    doLogin(){
      //检查数据
      if (this.hewieUser.userName === '') {
        this.$message.error('用户名不能为空');
        return;
      }
      if (this.originalPassword === '') {
        this.$message.error('密码不能为空');
        return;
      }
      if (this.loginInfo.verifyCode === '') {
        this.updateVerifyCode();
        this.$message.error('人类验证码不能为空');
        return;
      }
      if (this.isCommitting) {
        return;
      }
      this.isCommitting = true;
      this.hewieUser.password = hex_md5(this.originalPassword);
      Api.doLogin(this.loginInfo.verifyCode,
                  this.loginInfo.from,
                  this.hewieUser).then(result=>{
        this.isCommitting = false;
        if (result.code === 2001) {
          this.handleLoginSuccess(result);
        } else {
          this.updateVerifyCode();
          this.$message({
            message: result.message,
            center: true,
            type:'error'
          })
        }
      })
    },
    handleLoginSuccess(result){
      //跳转
      this.$message({
        message: result.message,
        center: true,
        type:'success'
      })
      //this.$router.push({path: '/'});
      //从地址中获取redirect
      let redirect = this.$route.query.redirect;
      if (redirect) {
        location.href = redirect;
      } else {
        location.href = '/';
      }
    },
    doChooseLoginType(type){
      this.loginType = type;
      if (type === '1' && this.qrCodeLoginKey === '') {
        this.getLoginQrCode();
      }
      if (type === '0') {
        this.qrCodeLoginKey = '';
        this.qrCodeImg = '';
      }
    },
    getLoginQrCode(){
      Api.getLoginQrCode().then(result=>{
        if (result.code === Api.success_code) {
          this.qrCodeLoginKey = result.data.code;
          this.qrCodeImg = result.data.url

          let qrCodeBox = document.getElementById('qr-code');
          if (qrCodeBox) {
            this.$refs.loginQrCode.error = false;
            qrCodeBox.style.display = 'block';
            this.checkLoginState();
          }
          let codeRefresh = document.getElementById('qr-code-refresh');
          if (codeRefresh) {
            codeRefresh.style.display = 'none'
          }
        }

      })
    },
    checkLoginState(){
      if (this.isScanStateChecking || this.loginType !== '1' || this.qrCodeLoginKey　=== ''){
        return;
      }
      this.isScanStateChecking = true;
      console.log('check...')
      Api.checkScanLoginState(this.qrCodeLoginKey).then(result=>{
        let code = result.code;
        this.isScanStateChecking = false;
        if (code === 2001) {
          this.handleLoginSuccess(result);
        } else if (code === 4010){
          console.log('timeout...')
          //过期
          this.onQrCodeLoadError();
        } else if (code === 4009){
          //等待扫码
          console.log('waiting...')
          this.checkLoginState();

        }

      })
    },
  },

}
</script>

<style>

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
.login-type{
  font-size: 14px;
  margin-left: 20px;
  font-weight: 400;
  cursor: pointer;
}

.login-tips{
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
#login-box{
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

.login-center-content-button {
  margin-bottom: 0px;
  border-left-width: unset;
}
.login-center-content-button .el-form-item__content {
  margin-left: 200px;
}

.login-center-content-box {
  width: 1140px;
  background: #fff ;
  box-shadow: 0 1px 10px #afafaf;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}
.login-center-content-box .el-input {
  width: 50%;
}

.login-center-content-box .el-form-item__label {
  background: #f9fafb;
  text-align: center;
  border-top: #dcdfe6 solid 1px;
  border-left: #dcdfe6 solid 1px;
  border-bottom: #dcdfe6 solid 1px;
}

.login-center-content-box .el-input__inner {
  border-radius: unset;
  border: #dcdfe6 solid 1px;
  height: 42px;
}

.login-center-content-box .el-input__inner:hover {
  border: #c0c4cc solid 1px;
}
</style>
