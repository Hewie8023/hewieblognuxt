<template>
  <div class="user-info-main-box">
    <div id="account-setting" class="account-setting">
      <div class="title">
        <span>帐户信息</span>
      </div>
      <div class="info-content">
        <div class="user-info">
          <div class="el-row">
            <div class="el-col el-col-4">
              <img size="large" :src="userInfo.avatar" class="el-avatar" />
              <div class="update-avatar-tips">
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
                  <i class="el-icon-male" style="color: rgb(64, 158, 255);"></i>程序猿
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
                <div v-if="!isChangeSkill">hang研</div>
                <div v-else>
                  <el-input type="text" placeholder="哪高就呢？" size="mini" style="max-width: 200px"></el-input>
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
                <div v-if="!isChangeSkill">学生</div>
                <div v-else>
                  <el-input type="text" placeholder="干啥的呀？" size="mini" style="max-width: 200px"></el-input>
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
                <div v-if="!isChangeSkill" v-text="(userInfo.sign === '' || userInfo.sign === null) ? '没有擅长领域' : userInfo.sign"></div>
                <div v-else>
                  <el-input type="text" placeholder="java/c艹/AI...？" size="mini" style="max-width: 200px"></el-input>
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
                <div v-if="!isChangeSkill" v-text="(userInfo.sign === '' || userInfo.sign === null) ? '小手一抖，bug就来了' : userInfo.sign"></div>
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
                <div class="title el-icon-s-promotion">&nbsp;邮箱</div>
              </div>
              <div class="el-col el-col-14">
                <div>{{userInfo.email}}</div>
              </div>
              <div class="el-col el-col-6">
                <button type="button" class="el-button modify-info-btn el-button--primary el-button--small is-plain">
                  <span>设置邮箱</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
      currentUserId:userId
    }
  },
  data(){
    return{
      isChangeSkill: false,
      isChangeInfo:false,
      hewieUser:{
        id:'',
        userName:'',
        sign:''
      },
    }
  },
  mounted() {
    this.checkLogin();
  },
  methods:{
    async checkLogin(){
      let checkInfo = await Api.checkToken();
      console.log(checkInfo)
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
      if (this.hewieUser.userName === '') {
        this.$message.error('请输入独一无二的花名');
        return;
      }

      let checkUserNameRes =  await Api.checkUserName(this.hewieUser.userName);
      if (checkUserNameRes.code === Api.success_code) {
        this.$message.error(checkUserNameRes.message);
        return;
      }
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
