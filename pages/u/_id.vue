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
          <span class="info">{{userInfo.workspace}}</span>
        </div>
        <div class="ucenter-user-job">
          <span class="label el-icon-s-platform"> 神位</span>
          <span class="info">{{userInfo.position}}</span>
        </div>
        <div class="ucenter-user-good-at">
          <span class="label el-icon-s-flag"> 法术</span>
          <span class="info">{{ userInfo.skills }}</span>
        </div>
      </div>
      <div class="ucenter-action" v-if="paramsUserId === currentUserId">
        <button  type="button" class="el-button el-button--primary el-button--mini" id="edit-info" @click="toEditUserInfoPage">
          <span>编辑资料</span>
        </button>
      </div>
    </div>

    <div id="user-bottom-part" class="clear-fix">
      <div id="user-bottom-left-part" class="float-left">
        <div class="wechat-prise left-card">
          <div class="card-title">个人成就</div>
          <div class="achievement-list">
            <div class="main">
              <span class="icon el-icon-edit-outline"></span>
              写了<span class="count">60</span>篇文章
            </div>
            <div class="sub">
              获得<span class="count">483</span>个点赞
            </div>

            <div class="main">
              <span class="icon el-icon-user"></span> 被<span class="count">63</span>人关注着
            </div>
          </div>
        </div>

        <div class="fast-operation" v-if="paramsUserId === currentUserId">
          <div class="card-title">快捷操作</div>
          <el-button size="small" class="operation-btn" type="primary" @click="postArticle">发表文章</el-button>
        </div>

      </div>
      <div id="user-bottom-right-part" class="float-left">
        <ul role="menubar" class="el-menu--horizontal el-menu" style="background-color:#fff;">
          <li role="menuitem" tabindex="0" class="el-menu-item">
            <i class="hewieblog hewiepinglun1"></i> <span>动态</span>
          </li>
          <li role="menuitem" tabindex="0" class="el-menu-item  is-active" >
            <i class="el-icon-document"></i> <span>文章</span>
          </li>
          <li role="menuitem" tabindex="0" class="el-menu-item" >
            <i class="hewieblog guanzhu"></i> <span>关注</span>
          </li>
          <li role="menuitem" tabindex="0" class="el-menu-item">
            <i class="hewieblog fensi1"></i> <span>粉丝</span>
          </li>

          <li role="menuitem" tabindex="0" class="el-menu-item">
            <i class="hewieblog hewieemptybox"></i> <span>(目前只有文章，其他待开发)</span>
          </li>
        </ul>

        <div id="ucenter-content-list">
          <div class="ucenter-normal-content">
            <div class="under-line ucenter-normal-content-item clear-fix" v-for="(item, index) in articles" :key="index">
              <div class="float-left">
                <a :href="'/article/'+item.id" target="_blank">
                  <div class="ucenter-content-title">
                    {{item.title}}
                    <el-tag v-if="item.state==='2'" type="danger" size="mini" style="margin-left: 20px">草稿</el-tag>
                  </div>
                  <div class="ucenter-content-info">
                    <img :src="item.hewieUserNoPassword.avatar" width="20px" height="20px" class="user-icon">
                    <span class="user-name">{{item.hewieUserNoPassword.userName}}</span>
                    <span class="create-time">{{item.createTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                    <span class="label"></span>
                  </div>
                </a>
              </div>
              <div class="article-action-part float-right" v-if="paramsUserId === currentUserId">
                <el-button size="mini" type="primary" @click="doEditArticle(item.id)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteArticle(item.id, item.title)">删除</el-button>
              </div>
            </div>

            <div class="ucenter-content-loader-more" v-if="!isLastPage" @click="doLoadMore">
              点击加载更多
            </div>
            <div class="ucenter-content-loader-more" v-if="isLastPage" >
              没有更多啦~
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="article-dialog-part">
      <el-dialog
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        title="删除提示"
        :visible.sync="deleteDialogShow"
        width="500px">
        <span>你确定要删除: {{deleteMessage}} 这篇文章吗？</span>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="doDeleteItem">删除</el-button>
        </span>
      </el-dialog>
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
  data(){
    return {
      currentPage:1,
      pageSize:10,
      deleteDialogShow:false,
      deleteMessage:'',
      articles:'',
      isLastPage: false,
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
  mounted() {
    this.listArticleList(this.paramsUserId, 1, 10);
  },
  methods:{
    listArticleList(){
      Api.getArticleList(this.paramsUserId, 1, 10).then(result=>{
        if (result.code === Api.success_code) {
          this.articles = result.data.content;
          this.isLastPage = result.data.last;
        }
      })
    },
    doDeleteItem(){
      Api.deleteArticlePretend(this.targetDeleteArticleId).then(result => {
        if (result.code === Api.success_code) {
          this.listArticleList();
          this.$message.success(result.message);
          this.deleteDialogShow = false;

        } else {
          this.$message.error(result.message);
        }
      })
    },
    deleteArticle(id, title){
      this.targetDeleteArticleId = id;
      this.deleteMessage = title;
      this.deleteDialogShow = true;
    },
    doEditArticle(id){
      location.href='/post?articleId='+id;
    },
    postArticle(){
      location.href='/post'
    },
    doLoadMore(){
      this.currentPage++;
      Api.getArticleList(this.userInfo.id, this.currentPage, this.pageSize).then(result=>{
        if (result.code === Api.success_code) {
          this.articles = this.articles.concat(result.data.content);
          this.isLastPage= result.data.last;
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    toEditUserInfoPage(){
      location.href = '/userInfo/' + this.userInfo.id;
    }
  }
}
</script>

<style>
.ucenter-content-loader-more {
  background: #fff;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border-radius: 6px;
}
.ucenter-content-info span {
  color: #8590a6;
  font-size: 14px;
  margin-left: 5px;
  margin-right: 5px;
  line-height: 30px;
}
.ucenter-content-info img {
  vertical-align: middle;
  border-radius: 50%;
  vertical-align: middle!important;
}
.ucenter-content-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 40px;
}
.ucenter-normal-content-item a {
  text-decoration: none;
  color: #909090;
}

.ucenter-normal-content-item {
  background: #fff;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
  vertical-align: middle;
}
.ucenter-normal-content{

}
#ucenter-content-list{
  display: block;
}

#user-bottom-part{
  margin-top: 20px;
}
#user-bottom-left-part{
  width: 300px;
}

#user-bottom-left-part .left-card{
  border-radius: 6px;
  margin-bottom: 20px;
  background: #ffffff;
}

#user-bottom-left-part .card-title {
  padding: 20px;
  font-size: 16px;
  color: #909090;
  font-weight: 600;
}

#user-bottom-left-part .achievement-list{
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  line-height: 40px;
  font-size: 16px;
}
#user-bottom-left-part .achievement-list .main {
  font-size: 15px;
  color: #47494e;
}
#user-bottom-left-part .achievement-list .count {
  margin-left: 5px;
  margin-right: 5px;
  color: #0084ff;
}
#user-bottom-left-part .achievement-list .sub {
  margin-left: 37px;
  color: #909090;
  font-size: 14px;
}
#user-bottom-left-part .fast-operation{
  border-radius: 6px;
  margin-bottom: 20px;
  background: #ffffff;
}
#user-bottom-left-part .operation-btn{
  margin: 10px 40px 20px 40px;
  width: 212px;
}

#user-bottom-right-part .el-menu.el-menu--horizontal {
  border-bottom: none;
  border-radius: 6px;
}

#user-bottom-right-part .el-menu {
  margin-bottom: 20px;
}
#user-bottom-right-part .is-active {
  color: #0084ff;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #409eff;
  color: #303133;
}
#user-bottom-right-part {
  width: 820px;
  margin-left: 20px;
}

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


#user-header-part .user-avatar:hover {
  transition: All .7s ease;
  transform: scale(1.1);
}
#user-header-part .user-avatar {
  position: absolute;
  left: 100px;
  top: 60px;
  border-radius: 4px;
  padding: 5px;
  background: #fff;
  transition: All .7s ease;
}
#user-header-part .user-avatar .el-image {
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

.ucenter-info-box .info{
  color: #7f828b;
}

.ucenter-action {
  position: absolute;
  bottom: 20px;
  right: 20px;
}


.article-action-part{
  margin-top: 20px;
}



</style>
