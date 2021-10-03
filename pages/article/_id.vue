<template>
  <div id="article-main-box">
    <div id="article-box" class="index-page-box clear-fix">
      <div class="article-action-part float-left">
        <div class="action-item hewieblog hewiedianzan">
        </div>
        <div class="action-item hewieblog hewieshoucang"></div>
        <div class="action-item hewieblog hewiefenxiang2"  @click="getArticleUrl"></div>
        <div style="display: none" ><el-input id="input" v-model="artileUrl"></el-input></div>
        <div class="action-item hewieblog hewiepinglun" @click="goToCommentBox"></div>
      </div>
      <div class="article-left-part float-left">
        <div class="article-content-box">
          <div class="article-title">
            <span v-text="article.title"></span>
          </div>
          <div class="article-cover">
            <img :src="'/portal/image/'+article.cover">
          </div>
          <div class="article-info">
            <img :src="article.hewieUserNoPassword.avatar"  style="object-fit:cover;"/>
            <span class="article-author">{{article.hewieUserNoPassword.userName}}</span>
            <span>发表于</span>
            <i class="hewieblog hewierili"></i>
            <span>{{article.createTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
            <i class="hewieblog hewieview"></i>
            <span>{{article.viewCount}}</span>
          </div>

          <div class="article-labels">
            <el-tag v-for="(item,index) in article.labelList" :key="index" type="info" size="mini">{{item}}</el-tag>
          </div>


          <div id="content-loading" class="content-loading" v-if="isArticleProcessing">
            <div class="loading-title clear-fix"></div>
            <div class="loading-content">
              <div class="loading-text"></div>
              <div class="loading-text animation-delay"></div>
              <div class="loading-text"></div>
            </div>
<!--            <div class="loading-info clear-fix">-->
<!--              <div class="loading-type"></div>-->
<!--              <div class="loading-avatar"></div>-->
<!--              <div class="loading-nickname"></div>-->
<!--            </div>-->
          </div>


          <div id="article-content" class="article-content" v-html="article.content" v-show="!isArticleProcessing"></div>

          <div class="right-show-text">
            <span class="el-icon-warning-outline"></span>
            本文由
            <a :href="'/u/'+article.userId" target="_blank" class="right-article-name">{{article.hewieUserNoPassword.userName}}</a>
            原创发布于
            <a href="/" target="_blank">幸运两小只</a>
            ，未经作者授权，禁止转载
          </div>
        </div>

        <div class="article-comment-box" >
          <div class="article-comment-input" id="article-comment-input">
            <div class="comment-part-title">评论</div>
            <div class="comment-input clear-fix">
              <div class="float-left" style="display: inline-block">
                <img v-if="userInfo !== null" :src="userInfo.avatar" class="comment-user-avatar"/>
                <img v-else class="comment-user-avatar" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"/>
              </div>
              <div class="comment-input-box float-left">
                <el-input
                  rows="4"
                  type="textarea"
                  placeholder="请输入评论内容"
                  v-model="comment.content"
                  maxlength="256"
                  show-word-limit
                  @focus="checkLogin"
                >
                </el-input>
              </div>

            </div>
            <div class="comment-submit-btn">
              <el-button type="primary" @click="doComment">发表评论</el-button>
            </div>
          </div>
          <div class="article-comment-list" id="article-comment-list">
            <div class="comment-part-title">评论列表</div>
            <div class="comment-item-list">
              <div class="article-comment-item" v-for="(item,index) in commentList" :key="'comment_'+index">
                <div class="article-comment-user-info">
                  <a :href="'/u/'+item.firstcomment.userId">
                    <el-avatar  :src="item.firstcomment.userAvatar"></el-avatar>
                    <span class="comment-user-name">{{item.firstcomment.userName}}</span>
                  </a>
                  <el-tag v-if="item.firstcomment.state === '2'" size="mini" type="danger">置顶</el-tag>
                </div>

                <div class="comment-content-detail">
                  <div class="article-comment-content">
                    {{item.firstcomment.content}}
                  </div>
                  <div class="article-comment-action clear-fix">
                    <span class="comment-time float-left">{{item.firstcomment.createTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                    <span class="item-replay-btn el-icon-chat-round" @click="onReplayClick(index, item.firstcomment.userId, item.firstcomment.userName)"> 回复</span>
                  </div>
                  <div class="article-comment-replay" v-if="item.replayList.length !== 0">
                    <div v-for="(subItem, subIndex) in item.replayList" :id="'replay_' + subIndex">
                      <div class="sub-comment-item">
                        <a :href="'/u/'+subItem.fromUid" target="_blank">
                          <div>
                            <img :src="subItem.fromUavatar" class="sub-comment-user-avatar">
                            <span class="sub-comment-nickname" v-text="subItem.fromUname"></span>
                          </div>
                        </a>
                        <div class="sub-comment-content">
                          回复
                          <a :href="'/u/'+subItem.toUid" target="_blank"> @ {{subItem.toUname}}</a>：
                          {{subItem.content}}
                        </div>
                        <div class="clear-fix">
                          <span class="sub-publish-time ">{{subItem.createTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                          <span class="sub-reply-text  el-icon-chat-round" @click="onReplayClick(index, subItem.fromUid, subItem.fromUname)"> 回复</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="article-sub-comment-box clear-fix" style="display: none" :id="'sub_comment_input_'+index">
                    <div class="sub-comment-input float-left">
                      <el-input
                        rows="2"
                        type="textarea"
                        :placeholder="subCommentPlaceholder"
                        v-model="subComment"
                        maxlength="256"
                        show-word-limit
                        @focus="checkLogin"
                      >
                      </el-input>
                    </div>
                    <div class="sub-comment-btn float-left">
                      <el-button type="primary" size="large" @click="doSubComment(item.firstcomment.id)"> 回复 </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="load-more-comment" v-if="!isLastPage" @click="doLoadMore">加载更多评论 >> </div>
            <div class="no-more-comment" v-if="isLastPage" @click="scrollInToComment">没有更多的评论咯，快来评论吧 >> </div>
          </div>
        </div>
        <div class="article-recommend-box">
          <div class="recommend-part-title">推荐文章</div>
          <div class="recommend-article-list">
            <div class="recommend-article-item clear-fix"  v-for="item in recommendArticles" :key="'recommend_'+item.id">
              <div class="float-left recommend-article-item-right">
                <div class="recommend-article-title">
                  <a :href="'/article/'+item.id" target="_blank">{{item.title}}</a>
                </div>
                <div class="recommend-article-labels-user">
                  <a href="#" target="_blank">{{item.hewieUserNoPassword.userName}}</a>
                  <span>·</span>
                  <span class="label-item" v-for="(subItem,subIndex) in item.labelList" :key="'label_'+subIndex">
                    <a :href="'/search?keyword=' + subItem" target="_blank">{{subItem}}</a>
                    <span v-if="subItem !== ''&& subIndex + 1 < item.labelList.length"> / </span>
                  </span>
                </div>
                <div class="recommend-article-info">
                  <span class="hewieblog hewierili">{{item.updateTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                  <span class="hewieblog hewieview"> {{item.viewCount}}</span>
                </div>
              </div>
              <div class="recommend-article-cover float-right">
                <img :src="'/portal/image/'+item.cover" style="object-fit: cover"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="article-right-part float-left">
        <div id="article-about-author" class="article-about-author">
          <div class="card-item-header">
            关于作者
          </div>
          <div class="article-user-info clear-fix">
            <div class="user-info-avatar float-left">
              <div class="user-icon" id="avatar-box">
                <el-avatar :src="article.hewieUserNoPassword.avatar" style="height: 55px; width: 55px; line-height: 55px;"></el-avatar>
              </div>
            </div>
            <div class="article-company-info float-left">
              <div class="article-user-name">
                <a :href="'/u/'+article.userId" target="_blank">{{article.hewieUserNoPassword.userName}}</a>
              </div>
              <div class="article-company"><span>{{article.hewieUserNoPassword.position}}</span>@<span>{{article.hewieUserNoPassword.workspace}}</span></div>
            </div>
          </div>
          <div class="user-info-list">
            <div class="main">
              <span class="icon el-icon-edit-outline"></span>
              <span class="info-tips">文章</span>
              <span class="count">{{ articleNum }}</span>
            </div>
            <div class="main">
              <span class="icon hewieblog hewieview"></span>
              <span class="info-tips">阅读</span>
              <span class="count">{{ viewNum }}</span>
            </div>
          </div>
        </div>
        <div id="hot-article-card" class="right-card border-radius-default">
          <div class="card-title">最新文章</div>
          <div class="top-article-list" v-for="(item, index) in lastTenArticles" :id="index">
            <div class="top-ten-article-item clear-fix">
              <div class="float-left">
                <img  :src="'/portal/image/'+ item.cover" style="width: 60px; border-radius: 4px; height: 50px; background: rgb(240, 240, 240); object-fit: cover;"/>
              </div>
              <div class="hot-right-side float-left">
                <a :href="'/article/'+item.id" target="_blank">{{item.title}}</a>
                <div>
                  <span>
                    {{item.hewieUserNoPassword.userName}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="article-category-list">
          <div class="card-item-header">
            文章目录
          </div>
          <div class="article-catelog-box" id="article-catelog-box"></div>
        </div>

      </div>
    </div>

    <div class="article-dialog-part">
      <el-dialog
        :visible.sync="isImageDialogShow">
        <img :src="targetImagePath"/>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import * as Api from "../../api/api";
import hljs from 'highlight.js';
import 'highlight.js/styles/lioshi.css';
import Catelog  from '../../utils/headerLineHandler'
let lastInputBox = null;
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  head() {
    return {
      titleTemplate: '幸运两小只-'+this.article.title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客-' + this.article.summary },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' + this.labelList }
      ]
    }
  },
  data(){
    return {
      artileUrl:'',
      isImageDialogShow:false,
      targetImagePath:'',
      userInfo:null,
      comment:{
        content:'',
        articleId:'',
        parentContent:'',
      },
      replay:{
        content:'',
        fatherCommentId:'',
        articleId:'',
        fromUid:'',
        toUid:''
      },
      subComment:'',
      currentPage:1,
      pageSize:5,
      subCommentPlaceholder:'回复 ',
      isArticleProcessing:true,
      toUid:'',
      isCopy: false,
      viewNum:'',
      articleNum:''
    }
  },
  async asyncData({params}){
    let articleRes = await Api.getArticleDetailById(params.id);
    let recommendArticleRes = await Api.getRecommendArticles(params.id, 10);
    //加載第一页评论数据
    let commentRes = await Api.getCommentsByArticleId(params.id, 1, 5);
    //console.log(commentRes)
    let labels = '';
    articleRes.data.labelList.forEach((label,index)=>{
      labels+=',';
      labels+=label;
    })
    let lastTenArticleRes = await Api.getLastTenArticles();
    return {
      article: articleRes.data,
      recommendArticles: recommendArticleRes.data,
      commentList:commentRes.data.commentContent,
      isLastPage: commentRes.data.last,
      labelList: labels,
      lastTenArticles:lastTenArticleRes.data.contents
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "index");
    hljs.initHighlighting();
    this.handleContentImgs();
    new Catelog({
      contentEl:'article-content',
      catalogEl:'article-catelog-box',
      selector: ['h1', 'h2', 'h3']
    })
    //添加滚动监听
    this.onWindowScroll();
    window.addEventListener('scroll', this.onWindowScroll);
    this.checkToken();
    let that = this;
    let timer = setInterval(function (){
      that.isArticleProcessing = false;
      clearInterval(timer)
    },500);
    //console.log(this.article.userId)
    this.getUserArticleAndView(this.article.userId)
    /*let e = document.querySelectorAll("code");

    let eLen = e.length;
    let i;
    for (i = 0; i < eLen; i++) {
      if (e[i].classList.contains("hljs")) {
        e[i].innerHTML = "<ul><li>" + e[i].innerHTML.replace(/\n/g, "\n</li><li>") + "\n</li></ul>";
      }
    }*/
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  methods:{
    scrollInToComment(){
      let commentBox = document.getElementById("article-comment-input");
      document.documentElement.scrollTo({
        top: commentBox.offsetTop,
        behavior: "smooth"
      })
    },
    doSubComment(commentId){

      if (this.subComment === '') {
        this.$message.error('回复内容不能为空');
        return;
      }
      this.replay.content = this.subComment;
      this.replay.articleId = this.article.id;
      this.replay.toUid = this.toUid;
      this.replay.fatherCommentId = commentId;


      Api.postReplay(this.replay).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.getArticleCommentByPage(1);
          this.resetComment();
          let commentBoxList = document.getElementById('article-comment-list');
          if (commentBoxList) {
            commentBoxList.scrollIntoView({
              block: "start",
              behavior:"smooth"
            })
          }
        } else {
          this.$message.error(result.message);
        }
      })
    },
    onReplayClick(index, userId, userName){
      this.toUid = userId;
      //console.log(this.toUid)
      let subInputBox = document.getElementById('sub_comment_input_'+index);
      this.subComment = '';
      this.subCommentPlaceholder = '回复 @ ' +userName;
      if (subInputBox) {
        if (lastInputBox) {
          lastInputBox.style.display = 'none';
        }
        lastInputBox = subInputBox;
        subInputBox.style.display = 'block';
      }
    },
    doLoadMore(){
      this.currentPage++;
      Api.getCommentsByArticleId(this.article.id, this.currentPage, this.pageSize).then(result=>{
        if (result.code === Api.success_code) {
          this.commentList = this.commentList.concat(result.data.commentContent);
          this.isLastPage= result.data.last;
        }
      }).catch(error=>{
        console.log(error);
      })
    },
    doComment(){
      let hewieBlogTokenIndex = document.cookie.indexOf('hewie_blog_token');
      if (hewieBlogTokenIndex === -1) {
        location.href = '/login?redirect='+location.href;
        return;
      }
      if (this.comment.content === '') {
        this.$message.error('评论内容不能为空');
        return;
      }
      this.comment.articleId = this.article.id;
      console.log(this.comment);
      Api.postComment(this.comment).then(result=>{
        if (result.code === Api.success_code) {
          this.$message.success(result.message);
          this.getArticleCommentByPage(1);
          this.resetComment();
        } else {
          this.$message.error(result.message);
        }
      })

    },
    resetComment(){
      this.comment.content = '';
      this.comment.parentContent = '';
      this.subComment = '';
      if(lastInputBox) {
        lastInputBox.style.display = 'none'
      }
    },
    getArticleCommentByPage(page){
      Api.getCommentsByArticleId(this.article.id, page, this.pageSize).then(result=>{
        if (result.code === Api.success_code) {
          this.commentList = result.data.commentContent;
          this.currentPage = page;
        }
      })
    },
    getUserArticleAndView(userId){
      if (userId !== '') {
        Api.getArticleNumByUserId(userId).then(result=>{
          if (result.code === Api.success_code) {
            this.articleNum = result.data;
          }
        });
        Api.getViewNumByUserId(userId).then(result=>{
          if (result.code === Api.success_code) {
            this.viewNum = result.data;
          }
        })
      }
    },
    checkToken(){
      Api.checkToken().then(result=>{
        if (result.code === Api.success_code) {
          this.userInfo = result.data;
          //console.log(this.userInfo)
        }
      })
    },
    checkLogin(){
      //检查是否有效
      Api.checkToken().then(result=>{
        if (result.code === 4002) {
          location.href = '/login?redirect='+location.href;
        }
      })
    },
    showImage(event){
      this.targetImagePath = event.target.src;
      this.isImageDialogShow = true;
    },
    handleContentImgs(){
      let contentBox = document.getElementById('article-content');
      let images = contentBox.querySelectorAll('img');
      images.forEach(item=>{
        item.addEventListener('click', this.showImage);
      })
    },
    onWindowScroll() {
      let catalogBox = document.getElementById('article-category-list');
      let userInfoBox = document.getElementById('article-about-author');
      let hotPart = document.getElementById('hot-article-card');
      let parentPart = document.getElementById('article-box');
      if (catalogBox) {
        let bottomOfWC = hotPart.offsetTop + hotPart.offsetHeight;
        let scrolledTop = document.documentElement.scrollTop;
        let scrolledLeft = document.documentElement.scrollLeft;
        if (scrolledTop >= bottomOfWC) {
          // console.log('显示悬浮内容...');
          catalogBox.style.position = 'fixed';
          catalogBox.style.top = '20px';
          catalogBox.style.width = '300px';
          //显示我们的悬浮内容
        } else {
          catalogBox.style.position = 'fixed';
          catalogBox.style.top = (bottomOfWC - scrolledTop + 20) + 'px';
          // console.log('隐藏悬浮内容...')
        }

        //处理左右滑动
        if (scrolledLeft > 0) {
          catalogBox.style.left = parentPart.offsetLeft + parentPart.offsetWidth
            - catalogBox.offsetWidth - scrolledLeft + 'px';
        } else {
          //正常状态的，左边应该它老爸的左边
          catalogBox.style.left = parentPart.offsetLeft + parentPart.offsetWidth
            - catalogBox.offsetWidth + 'px';
        }
      }
    },
    goToCommentBox(){
      let commentBox = document.getElementById("article-comment-input");
      document.documentElement.scrollTo({
        top: commentBox.offsetTop,
        behavior: "smooth"
      })
    },
    getArticleUrl(){
      this.artileUrl = location.href;
      this.$copyText(this.artileUrl).then(function (e) {
        //alert('Copied')
        this.isCopy = true;
      }, function (e) {
        //alert('Can not copy')
        this.isCopy = false;
      });
      this.$message.success('分享链接复制成功')
    }
  }

}
</script>
<style>
.el-icon-warning-outline {
  color: #3377ff;
  font-weight: 600;
}
.right-article-name{
  color: #666;
  font-size: 16px;
  margin-left: 5px;
  margin-right: 5px;
  font-weight: 600;
}
.right-show-text a{
  text-decoration: none;
  color: #909090;
}
.right-show-text {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 20px;
  color: #909090;
}
#article-catelog-box .cl-link span {
  line-height: 26px;
  margin-top: 4px;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
#article-catelog-box .cl-link-active > span{
  color: #3377ff !important;
  background-color: #ebedef;
  display: block;
}
#article-catelog-box li>span:hover{
  color: #3377ff;
}
#article-catelog-box li span{
  cursor: pointer;
}
#article-catelog-box ul{
  margin-left: 30px;
  line-height: 30px;
}
#article-catelog-box{
  max-height: 300px;
  overflow: hidden;
}

.card-item-header {
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
  color: #909090;
  font-weight: 600;
}

#article-category-list{
  background: #fff;
  border-radius: 6px;
  width: 300px;
  padding-right: 5px;
}

.recommend-article-cover img {
  width: 77px;
  -o-object-fit: cover;
  object-fit: cover;
  height: 77px;
  vertical-align: middle!important;
}

.recommend-article-info span {
  margin-right: 10px;
}

.recommend-article-info{
  font-size: 14px;
  margin-top: 10px;
  color: #6c757d;
}
.recommend-article-labels-user a:hover {
  color: #0084ff;
}
.recommend-article-labels-user a {
  color: #7f828b;
}

.recommend-article-labels-user{
  font-size: 14px;
  margin-bottom: 10px;
  max-width: 600px;
  display: block;
  overflow-x: hidden;
  color: #b2bac2;
}
.recommend-article-title a:hover {
  color: #37f;
}
.recommend-article-title a {
  color: #47494e;
}

.recommend-article-title{
  display: -webkit-box;
  max-width: 610px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
}

.recommend-article-item{
  border-bottom: 1px solid #f5f5f5;
  padding-bottom: 20px;
  padding-top: 20px;
}
.article-sub-comment-box{
  margin-top: 10px;
}
.sub-comment-input .el-textarea{
  width: 500px !important;
}
.sub-comment-input {
  margin-right: 20px;
}
.sub-comment-btn{
  margin-top: 5px;
}


.load-more-comment:hover,.no-more-comment:hover{
  color: #3377ff;
}
.load-more-comment,.no-more-comment{
  padding: 10px;
  text-align: center;
  cursor: pointer;
  margin-top: 20px;
  color: #b2bac2;
}

.article-comment-replay{
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;
  overflow: hidden;
  background: #fafbfc;
  padding: 10px;
  border-radius: 4px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.sub-comment-item {
  border-bottom: 1px solid #f0f7ff;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.sub-comment-user-avatar {
  border-radius: 50%;
  height: 25px;
  margin-right: 10px;
  margin-bottom: -8px;
  width:25px;
}
.sub-comment-nickname {
  color: #7f828b;
}

.sub-comment-content {
  padding: 10px;
  margin: 5px 30px;
  line-height: 24px;
  font-size: 14px;
  color: #999;
}

.sub-comment-content a {
  color: #0084ff;
}
.sub-publish-time {
  float: left;
  font-size: 13px;
  margin-left: 40px;
  color: #8a93a0;
}
.sub-reply-text {
  float: right;
  cursor: pointer;
  font-size: 14px;
  color: #8a93a0;
}
.article-comment-content{
  line-height: 24px;
  max-width: 500px;
  padding-top: 10px;
  padding-bottom: 10px;
  word-wrap: break-word;
  word-break: break-all;
  color: #505050;
  font-size: 15px;
  overflow: hidden;
}

.comment-content-detail {
  margin-left: 45px;
  border-bottom: 1px solid #f1f1f1;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.item-replay-btn{
  cursor: pointer;
  float: right;
  margin-right: 10px;
  font-size: 14px;
  color: #8a93a0;
}
.article-comment-action{
  color: #b2bac2;
  text-align: right;
}

.comment-time{
  color: #8a93a0;
  font-size: 13px;
}

.comment-item-list{
  margin-top: 10px;
}
.comment-user-name{
  font-weight: 600;
  color: #93999f;
  font-size: 16px;
  line-height: 30px;
  margin-left: 10px;
}
.article-comment-user-info{
  margin-bottom: 10px;
}

.article-comment-item{
  padding: 10px 0;
  border-bottom: #f5f5f5 1px solid;
}

.article-comment-user-info .el-avatar{
  width: 30px;
  height: 30px;
  border-radius: 50px;
  display: inline-block;
  vertical-align: middle;
}

.comment-submit-btn{
  padding: 0 10px 0 20px;
  text-align: right;
}
.comment-user-avatar{
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.comment-input-box{
  width: 680px;
}
.comment-input{
  display: inline-block;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
}
.article-comment-input{
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}
.recommend-part-title ,.comment-part-title{
  font-size: 18px;
  font-weight: 600;
  color: #37f!important;
}

.recommend-article-list {
  margin-top: 20px;
  border-top: 1px solid #f5f5f5;
}

.article-content-box{
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

.article-comment-list{
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

/*.article-comment-box{*/
/*  margin-bottom: 20px;*/
/*  background: #fff;*/
/*  border-radius: 6px;*/
/*  padding: 20px;*/
/*}*/

.article-recommend-box{
  background: #fff;
  border-radius: 6px;
  padding: 20px;
}

.article-dialog-part .el-dialog{
  width: fit-content;
}

.article-dialog-part .el-dialog__body{
  padding: 10px;
}

.article-dialog-part .el-dialog__header .el-dialog__headerbtn{
  display: none;
}
.article-dialog-part .el-dialog__header{
  padding: 0;
}

#article-main-box{
  width: 1140px;
  margin: 0 auto;
}
.index-page-box {
  margin-top: 20px;
  margin-bottom: 20px;

}

.article-action-part .action-item:hover {
  color: #3377ff;
}
.article-action-part .action-item{
  font-size: 24px;
  font-weight: 600;
  color: #93999f;
  margin: 30px 5px;
  cursor: pointer;

}
.article-action-part{
  position: fixed;
  top: 140px;
  width: 20px;
  margin-right: 25px;
}

.article-left-part{
  width: 780px;
  margin-left: 40px;
  margin-right: 20px;
}

#avatar-box{
  vertical-align: middle;
}
.article-company{
  font-size: 13px;
  line-height: 22px;
  color: #909090;
}
.article-user-name a:hover{
  color: #37f;
}
.article-user-name a{
  color: #47494e;
}
.article-user-name {
  font-size: 16px;
  line-height: 22px;
  font-weight: 600;
  color: #666;
}

.article-company-info{
  margin-left: 10px;
  max-width: 210px;
}

.article-user-info {
  padding: 10px;
}
.card-item-header {
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
  color: #909090;
  font-weight: 600;
}

.article-about-author{
  background: #fff;
  border-radius: 6px;
  margin-bottom: 20px;
}

.article-right-part{
  width: 300px;
  padding-bottom: 40px;
}

.article-left-part .article-title{
  font-size: 1.75rem;
  color: #212529;
  font-weight: 600;
  line-height: 36px;
  margin-bottom: 20px;
}

.article-left-part .article-info img{
  vertical-align: middle;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.article-left-part .article-info span{
  line-height: 32px;
}
.article-left-part .article-info{
  line-height: 32px;
  margin-bottom: 10px;
  font-size: 15px;
  color: #909090;
}

.article-author{
  color: #666;
  font-size: 16px;
  margin-left: 5px;
  margin-right: 5px;
  font-weight: 600;
}

.article-labels{
  margin-bottom: 20px;
}
.article-labels .el-tag{
  margin-right: 10px;
  cursor: pointer;
}

.article-content{
  margin-top: 50px;
  color: #333!important;
  line-height: 28px;
  font-size: 14px;
}
.article-content img{
  max-width: 740px;
  padding: 10px 0;
  cursor: zoom-in;
}
.article-cover {
  overflow: hidden;
  margin-bottom: 20px;
  margin-top: 20px;
  line-height: 40px;
}
.article-cover img {
   -o-object-fit: cover;
   object-fit: cover;
   width: 100%;
   max-height: 200px;
   border-radius: 4px;
 }
.article-content p{
  padding: 10px 0;
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
}
.article-content h1{
  font-size: 1.75rem;
  margin: 2.5rem 0 1rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px double rgba(0,0,0,.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.article-content h2 {
  font-size: 1.55rem;
  margin: 15px -20px;
  padding: 0 25px;
  border-left: 5px solid #0084ff;
  background-color: #f7f7f7;
  line-height: 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.article-content h3 {
  font-size: 1.25rem;
  margin: 2rem 0 1rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}

.article-content blockquote {
  padding-left: 12px;
  font-size: 16px;
  color: #7f828b;
  margin-top: 15px;
  margin-bottom: 15px;

  border-left: 3px solid #0084ff;
}
.article-content, p {
  word-break: break-all;
}
.article-content a:hover{
  color: #0084ff;
}
.article-content a {
  text-decoration: none;
  color: #909090;
}
.article-content code {
  margin-top: 20px;
  padding: 20px;
  font-size: 90%;
  max-height: 35rem;
  line-height: 1.8;
  overflow: auto;
}

.article-content  p code , .article-content ol code, .article-content ol li code, .article-content ul code, .article-content ul li code{
  word-break: break-word;
  border-radius: 2px;
  margin-left: 3px;
  margin-right: 3px;
  overflow-x: auto;
  background-color: #f7f7f7;
  color: #ff502c;
  font-size: 90%;
  padding: .065em .4em!important;
  display: inline!important;
}


.article-content ul, .article-content ol{
  margin-left: 20px;
}
/*background: #f0f0f0 !important;*/
.article-content .hljs {
  display: block;
  border-radius: 2px;
  font: 14px/20px "Microsoft YaHei",Arial,Sans-Serif;
}


.article-content pre code::-webkit-scrollbar {
  width: 8px ;
  height: 6px ;
}
.article-content pre code::-webkit-scrollbar-thumb {
  border-radius: 4px ;
  background-color: #cbcbcb;
}
.article-content pre code::-webkit-scrollbar-thumb:hover {
  background-color: #3377ff;
}

.article-content pre{
  max-height: 700px;
}
.article-content pre code{
  padding: 10px;
}

.content-loading {
  padding: 10px;
  background: #f3f3f3;
  margin-top: 5px;
}
.loading-title {
  width: 200px;
  height: 24px;
  background-color: #eaeaea;
}
.loading-content {
  margin-left: 10px;
  margin-top: 10px;
  width: 600px;
}
.loading-text {
  width: 100%;
  height: 16px;
  margin: 0 0 10px;
  background-color: #eaeaea;
  -webkit-animation: loading 1s ease-in-out infinite;
  animation: loading 1s ease-in-out infinite;
}
.animation-delay {
  -webkit-animation: loading 1s ease-in-out -.5s infinite;
  animation: loading 1s ease-in-out -.5s infinite;
}
@keyframes loading {
  0% {
    width: 60%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 60%;
  }

}

.loading-info {
  display: inline-block;
  width: 100%;
  height: 30px;
}

.loading-avatar {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #eaeaea;
  margin-left: 10px;
  float: left;
}

.loading-nickname {
  width: 100px;
  margin-left: 50px;
  height: 20px;
  background: #eaeaea;
}

/*.hljs ul li::marker{*/
/*  content: counter(list-item)"    ";*/
/*  color: #93999f!important;*/
/*  font-size: 16px;*/
/*  font-weight: 600;*/
/*}*/

/*.hljs ul {*/
/*  list-style: decimal;*/
/*  margin: 0 0 0 40px!important;*/
/*  padding: 0*/
/*}*/
/*.hljs li {*/
/*  list-style: decimal-leading-zero;*/
/*  border-left: 2px solid #3377ff!important;*/
/*  padding: 4px 5px!important;*/
/*  margin: 0!important;*/
/*  line-height: 14px;*/
/*  width: 100%;*/
/*  box-sizing: border-box*/
/*}*/
/*.hljs li:nth-of-type(even) {*/
/*  background-color: rgba(255,255,255,.015);*/
/*  color: inherit*/
/*}*/

.user-info-list{
  padding-left: 15px;
  padding-bottom: 10px;
  padding-right: 20px;
  line-height: 40px;
  font-size: 16px;
  color: #646464;
}

.user-info-list .icon {
  background: #e1efff;
  padding: 8px;
  border-radius: 50%;
  color: #0084ff;
}

.user-info-list .info-tips {
  margin-left: 10px;
  margin-right: 4px;
}

.user-info-list .count {
  color: #0084ff;
}

.right-card{
  padding: 10px;
  width: 100%;
  margin-bottom: 20px;
  background: #fff
}

.right-card .card-title{
  font-size: 16px;
  font-weight: 550;
  color: #7f828b;
  padding: 5px;
  border-bottom: #f4f4f4 solid 1px;
}

.top-ten-article-item a{
  text-decoration: none;
  color: #2b2b2b;
  white-space:nowrap;
  text-overflow:ellipsis;
  -webkit-text-overflow:ellipsis;
  overflow:hidden;
  margin-bottom: 10px;
}
.top-ten-article-item .hot-right-side span{
  color: #93999f;
  font-size: 13px;
}
.top-ten-article-item .hot-right-side{
  max-width: 100px;
  margin-left: 5px;
}
.top-ten-article-item{
  padding: 5px;

  border-bottom: 1px solid #f4f4f4;

}
</style>
