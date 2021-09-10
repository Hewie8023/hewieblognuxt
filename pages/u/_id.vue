<template>
  <div class="user-info-main-box" id="user-info-main-box">
    <div id="user-header-part">
      <div id="user-info-bg" class="user-info-bg">
        <el-image :src="userInfo.avatar" fit="cover"></el-image>
      </div>
      <div class="user-avatar">
        <el-image :src="userInfo.avatar"></el-image>
      </div>
      <div class="ucenter-info-box">
        <div class="user-name-sign">
          <span class="ucenter-user-name">{{userInfo.userName}}</span>
          <span class="ucenter-user-sign">{{userInfo.sign}}</span>
        </div>
        <div class="ucenter-user-compony">
          <span class="label el-icon-office-building"> 庙号</span>
          <span>hang研</span>
        </div>
        <div class="ucenter-user-job">
          <span class="label el-icon-s-platform"> 神位</span>
          <span>学生</span>
        </div>
        <div class="ucenter-user-good-at">
          <span class="label el-icon-s-flag"> 法术</span>
          <span>重启电脑</span>
        </div>
      </div>
      <div class="ucenter-action" v-if="paramsUserId === currentUserId">
        <button  type="button" class="el-button el-button--primary el-button--mini" id="edit-info" @click="toEditUserInfoPage">
          <span>编辑资料</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
export default {
  head() {
    return {
      titleTemplate: '幸运两小只-'+this.userInfo.userName+'-用户中心',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，用户信息中心' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  async asyncData(context) {
    let userId = context.params.id;
    let userInfoRes = await Api.getUserInfo(userId);
    return {
      userInfo: userInfoRes.data,
      paramsUserId: userId
    }
  },
  computed:{
    currentUserId(){
      return this.$store.state.currentUserId;
    }
  },
  watch:{
    currentUserId(newValue){
      //console.log("newValue==>"+newValue)
    }
  },
  methods:{
    toEditUserInfoPage(){
      location.href = '/userInfo/' + this.userInfo.id;
    }
  }
}
</script>

<style>
.user-info-main-box{
  width: 1140px;
  margin: 0 auto;
}
#user-info-bg .el-image {
  height: 148px;
  width: 1140px;
  filter: blur(2px) contrast(.8);
}
#user-header-part{
  border-radius: 6px;
  position: relative;
  height: 412px;
  margin-top: 20px;
  background: #fff;
}
.user-avatar:hover {
  transition: All .7s ease;
  transform: scale(1.1);
}
.user-avatar {
  position: absolute;
  left: 100px;
  top: 60px;
  border-radius: 4px;
  padding: 5px;
  background: #fff;
  transition: All .7s ease;
}
.user-avatar .el-image {
  width: 170px;
  vertical-align: middle;
  height: 170px;
}

.ucenter-info-box {
  left: 50%;
  font-size: 14px;
  line-height: 40px;
  position: absolute;
  top: 50%;
  margin-top: -50px;
  margin-left: -250px;
}
.user-name-sign {
  line-height: 40px;
}
.ucenter-user-name {
  font-size: 20px;
  font-weight: 600;
  line-height: 60px;
}
.ucenter-user-sign {
  color: #595959;
  margin-left: 12px;
  font-size: 16px;
  white-space: nowrap;
}
.ucenter-info-box .label {
  font-size: 16px;
  margin-right: 37px;
  font-weight: 600;
  color: #595959;
}

.ucenter-action {
  position: absolute;
  bottom: 20px;
  right: 20px;
}






</style>
