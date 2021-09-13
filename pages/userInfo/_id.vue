<template>
  <div class="user-info-main-box">
    <div id="account-setting" class="account-setting">
      <div class="title">
        <span>帐户信息</span>
      </div>
      <div class="info-content">
        <div class="user-info">
          <div class="el-row">
            <div class="el-col el-col-4" @click="showAvatarDialog" >
              <el-avatar size="large" :src="userInfo.avatar"></el-avatar>
              <div  class="update-avatar-tips" >
                修改头像
              </div>
            </div>
            <div class="el-col el-col-14">
              <div class="nick-name" >
                <div v-if="!isChangeInfo">{{userInfo.userName}}</div>
                <div v-else>
                  <el-popover
                    placement="top"
                    width="220"
                    trigger="hover"
                    content="花名要独一无二，万中无一">
                    <el-input v-model="hewieUser.userName" slot="reference" type="text" placeholder="请输入花名" size="mini" style="max-width: 200px"></el-input>
                  </el-popover>
                </div>
              </div>

              <div class="sex">
                <div class="value-text">
                  <div v-if="!isChangeInfo">
                    <div v-if="userInfo.sex === '0'"><i class="el-icon-female" style="color: rgb(245, 108, 108);"></i>程序猿</div>
                    <div v-else-if="userInfo.sex === '1'"><i class="el-icon-male" style="color: rgb(64, 158, 255);"></i>程序猿</div>
                    <div v-else><i class="el-icon-key" style="color:rgb(230, 162, 60);"></i>程序员</div>
                  </div>
                  <div v-else>
                    <el-select v-model="hewieUser.sex" placeholder="请选择" size="small">
                      <el-option label="程序媛" value="0"></el-option>
                      <el-option label="程序猿" value="1"></el-option>
                      <el-option label="程序员" value="2"></el-option>
                    </el-select>
                  </div>

                </div>
              </div>
            </div>
            <div class="el-col el-col-6">
              <button v-if="!isChangeInfo" @click="doChangeInfo" type="button" class="el-button  el-icon-edit el-button--primary el-button--small is-plain">
                <span>&nbsp;修改信息</span>
              </button>
              <div v-else>
                <button  @click="doSubmitChangeInfo" type="button" class="el-button el-button--success el-button--small is-plain">
                  <span>确认</span>
                </button>

                <button  @click="doCancelChangeInfo" type="button" class="el-button el-button--danger el-button--small is-plain">
                  <span>取消</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="work-info">
          <div class="company-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <span>&nbsp;</span>
              </div>
              <div class="el-col el-col-14">
                <span>&nbsp;</span>
              </div>
              <div class="el-col el-col-6">
                <button  v-if="!isChangeSkill" @click="doChangeSkill" type="button" class="el-button el-button--primary el-button--small is-plain">
                  <span>切换技能</span>
                </button>
                <div v-else>
                  <button  @click="updateSkills" type="button" class="el-button el-button--success el-button--small is-plain">
                    <span>确认</span>
                  </button>

                  <button  @click="doCancelChangeSkill" type="button" class="el-button el-button--danger el-button--small is-plain">
                    <span>取消</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="company-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <div class="title el-icon-office-building">&nbsp;公司</div>
              </div>
              <div class="el-col el-col-14" >
                <div class="info" v-if="!isChangeSkill" v-text="(userInfo.workspace === '' || userInfo.workspace === null) ? '地球村' : userInfo.workspace"></div>
                <div v-else>
                  <el-input v-model="hewieUser.workspace" type="text" placeholder="哪高就呢？" size="mini" style="max-width: 200px"></el-input>
                </div>
              </div>
              <div class="el-col el-col-6">

              </div>
            </div>
          </div>
          <div class="job-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <div class="title el-icon-s-platform">&nbsp;职位</div>
              </div>
              <div class="el-col el-col-14">
                <div class="info" v-if="!isChangeSkill" v-text="(userInfo.position === '' || userInfo.position === null) ? '神农' : userInfo.position"></div>
                <div v-else>
                  <el-input v-model="hewieUser.position" type="text" placeholder="干啥的呀？" size="mini" style="max-width: 200px"></el-input>
                </div>
              </div>
              <div class="el-col el-col-6">

              </div>
            </div>
          </div>
          <div class="good-at-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <div class="title el-icon-s-flag">&nbsp;擅长</div>
              </div>
              <div class="el-col el-col-14">
                <div class="info" v-if="!isChangeSkill" v-text="(userInfo.skills === '' || userInfo.skills === null) ? '没有擅长领域' : userInfo.skills"></div>
                <div v-else>
                  <el-input v-model="hewieUser.skills" type="text" placeholder="java/c艹/AI...？" size="mini" style="max-width: 200px"></el-input>
                </div>
              </div>
              <div class="el-col el-col-6">

              </div>
            </div>
          </div>
          <div class="sign-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <div class="title el-icon-edit-outline">&nbsp;签名</div>
              </div>
              <div class="el-col el-col-14">
                <div class="info" v-if="!isChangeSkill" v-text="(userInfo.sign === '' || userInfo.sign === null) ? '小手一抖，bug就来了' : userInfo.sign"></div>
                <div v-else>
                  <el-input v-model="hewieUser.sign" type="text" placeholder="专业写bug 20年..." size="mini" style="max-width: 500px" maxlength="60" show-word-limit></el-input>
                </div>
              </div>
              <div class="el-col el-col-6">

              </div>
            </div>
          </div>
        </div>
        <div class="email-box">
          <div class="email-container">
            <div class="el-row">
              <div class="el-col el-col-4">
                <div  class="title el-icon-s-promotion">&nbsp;邮箱</div>
              </div>
              <div class="el-col el-col-14">
                <div class="info">{{userInfo.email}}</div>
              </div>
              <div class="el-col el-col-6">
                <button @click="modifyEmailBtn" type="button" class="el-button modify-info-btn el-button--primary el-button--small is-plain">
                  <span>设置邮箱</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="更新邮箱"
        :visible.sync="modifyEmailDialogShow"
        width="500px">
        <el-form label-width="100px" size="small">
          <el-form-item label="人类验证码">
            <el-input style="max-width: 200px" v-model="captchaCode" placeholder="请输入右侧验证码"></el-input>
            <img
              :src="captchaPath"
              @click="updateVerifyCode"
              class="captcha-code"/>
          </el-form-item>
          <el-form-item label="新邮箱地址">
            <el-input style="max-width: 200px" v-model="newEmail"></el-input>
            <el-button style="margin-left: 10px" v-if="!isCountingDown" type="primary" @click="getVerifyCode" class="email-get-verify-code-btn">获取验证码</el-button>
            <el-button style="margin-left: 10px" v-else type="primary" class="email-get-verify-code-btn" disabled>{{ getVerifyCodeBtnText }}</el-button>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input style="max-width: 200px" v-model="verifyCode" class="email-verify-code-input"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="updateEmailAddr">更新邮箱</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>


      <avatarUpload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showAvatarCutter"
                     :width="300"
                     :height="300"
                     url="/admin/image/avatar"
                     img-format="png">
      </avatarUpload>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'

export default {

  async asyncData(context) {
    let userId = context.params.id;
    let userInfoRes = await Api.getUserInfo(userId);
    return {
      userInfo: userInfoRes.data,
      currentUserId:userId,
      captchaPath: '/user/captcha',
    }
  },
  data(){
    return{
      modifyEmailDialogShow:false,
      isChangeSkill: false,
      isChangeInfo:false,
      hewieUser:{
        id:'',
        userName:'',
        sign:'',
        sex: '',
        workspace:'',
        position:'',
        skills:'',
        avatar:''
      },
      newEmail:'',
      verifyCode:'',
      getVerifyCodeBtnText:'重新发送（60）',
      isCountingDown: false,
      captchaCode:'',
      showAvatarCutter: false,
    }
  },
  mounted() {
    this.checkLogin();
    this.updateVerifyCode();
  },
  methods:{
    cropUploadSuccess( response ) {
      this.hewieUser.id = this.currentUserId;
      if (response.code === Api.success_code) {
        this.userInfo.avatar = '/portal/image/' + response.data.id;
        this.hewieUser.avatar = '/portal/image/' + response.data.id;
        this.$message.success(response.message)
        Api.updateUserInfo(this.hewieUser, this.hewieUser.id).then(result => {
          if (result.code === Api.success_code) {
            this.getUserInfo();
            this.$message.success(result.message);
          }else {
            this.$message.error(result.message);
          }
        })
      } else {
        this.$message.error(response.message)
      }
    },
    cropUploadFail() {
      this.$message.error("上传失败");
    },
    showAvatarDialog(){
      this.showAvatarCutter = true;
    },
    async checkLogin(){
      let checkInfo = await Api.checkToken();
      //console.log(checkInfo)
      if (checkInfo.code === 4002) {
        location.href = '/login'
      }
      if (checkInfo.data.id !== this.currentUserId) {
        location.href = '/'
      }
    },
    getUserInfo(){
      Api.getUserInfo(this.currentUserId).then(result=>{
        if (result.code === Api.success_code) {
          this.userInfo = result.data;
        }
      })
    },
    doChangeSkill(){
      this.isChangeSkill = true;
    },
    doCancelChangeSkill(){
      this.isChangeSkill = false;
    },
    doChangeInfo(){
      this.isChangeInfo = true;
    },
    doCancelChangeInfo(){
      this.isChangeInfo = false;
    },
    async doSubmitChangeInfo(){
      this.hewieUser.id = this.currentUserId;
      // if (this.hewieUser.userName === '') {
      //   this.$message.error('请输入独一无二的花名');
      //   return;
      // }

      let checkUserNameRes =  await Api.checkUserName(this.hewieUser.userName);
      if (checkUserNameRes.code === Api.success_code) {
        this.$message.error(checkUserNameRes.message);
        return;
      }
      console.log(this.hewieUser.sex)
      //console.log(this.hewieUser)
      Api.updateUserInfo(this.hewieUser, this.currentUserId).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.isChangeInfo = false;
          this.getUserInfo();
        } else {
          this.$message.error(result.message);
        }
      })
    },
    async updateSkills(){
      this.hewieUser.id = this.currentUserId;
      Api.updateUserInfo(this.hewieUser, this.currentUserId).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.isChangeSkill = false;
          this.getUserInfo();
        } else {
          this.$message.error(result.message);
        }
      })
    },
    modifyEmailBtn(){
      this.modifyEmailDialogShow = true;
    },
    getVerifyCode() {

      if (this.captchaCode === '') {
        this.$message.error('请输入人类验证码');
        return;
      }

      //1、校验邮箱格式
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱格式不正确');
        return
      }
      //this.$message.success('邮箱格式正确');
      //2、禁止按钮，开始倒计时
      console.log(this.newEmail)
      //3、发起请求
      Api.getVerifyCode(this.newEmail, 'update', this.captchaCode).then(result => {
        if (result.code === Api.success_code) {
          this.startCountDown();
          this.$message.success(result.message);
        } else  {
          this.$message.error(result.message);
        }
      });
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
    updateEmailAddr(){
      if (this.newEmail === '') {
        this.$message.error('邮箱地址不能为空');
        return;
      }
      if (this.verifyCode === '') {
        this.$message.error('验证码不能为空');
        return;
      }
      Api.updateEmailAddr(this.newEmail, this.verifyCode).then(result => {
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.verifyCode = '';
          this.newEmail = '';
          this.modifyEmailDialogShow = false;
          this.captchaCode = '';
          this.getUserInfo();
        } else {
          this.$message.error(result.message);
          this.verifyCode = '';
        }
      })
    },
    updateVerifyCode() {
      this.captchaPath = '/user/captcha?random = ' + Date.parse(new Date());
      //console.log(this.captchaPath);
    },
  }
}
</script>

<style>
.user-info-main-box{
  width: 1140px;
  margin: 0 auto;
}

#account-setting {
  padding: 20px 30px;
  border-radius: 6px;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px 0 rgb(0 0 0 / 12%);
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 12%);
}
#account-setting .title span {
  font-weight: 400;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
}
.info-content{
  margin-top: 30px;
  margin-bottom: 30px;
}
.info-content .info{
  font-size: 14px;
  color: #595959;
}
.info-content .user-info .el-avatar{
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 50%;
}
.info-content .user-info{
  position: relative;
  border-bottom: #d9ecff 1px dashed;
  padding-bottom: 30px;
}
.info-content .user-info .update-avatar-tips {
  opacity: 0.1;
  text-align: center;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 100px;
  color: #fff;
  font-size: 16px;
  background: rgba(0,0,0,0.2);
  border-radius: 50%;
  cursor: pointer;
  width: 100px;
}
.info-content .user-info .update-avatar-tips:hover {
  opacity: 0.9;
}

.info-content .user-info  .nick-name {
  margin-top: 10px;
  font-size: 30px;
}
.info-content .user-info  .sex {
  margin-top: 18px;
  font-size: 16px;
}
.info-content .work-info {
  margin-bottom: 30px;
  margin-top: 10px;
}
.info-content .title {
  font-size: 16px;
  font-weight: 600;
}

.info-content .work-info  .el-row {
  line-height: 50px;
}
.info-content .email-box {
  border-top: #d9ecff 1px dashed;
  line-height: 60px;
}
</style>
