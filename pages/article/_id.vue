<template>
  <div id="article-main-box">
    <div id="article-box" class="index-page-box clear-fix">
      <div class="article-left-part float-left">
        <div class="article-content-box">
          <div class="article-title">
            <span v-text="article.title"></span>
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
            </div>
            <div class="loading-info clear-fix">
              <div class="loading-type"></div>
              <div class="loading-avatar"></div>
              <div class="loading-nickname"></div>
            </div>
          </div>


          <div id="article-content" class="article-content" v-html="article.content" v-show="!isArticleProcessing"></div>

          <div class="right-show-text">
            <span class="el-icon-warning-outline"></span>
            本文由
            <a :href="'/user/'+article.userId" target="_blank" class="right-article-name">{{article.hewieUserNoPassword.userName}}</a>
            原创发布于
            <a href="/" target="_blank">幸运两小只</a>
            ，未经作者授权，禁止转载
          </div>
        </div>

        <div class="article-comment-box" >
          <div class="article-comment-input" id="article-comment-input">
            <div class="comment-part-title">评论</div>
            <div class="comment-input clear-fix">
              <div class="float-left">
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
                  <a :href="'/u/'+item.userId">
                    <el-avatar :src="item.userAvatar"></el-avatar>
                    <span class="comment-user-name">{{item.userName}}</span>
                  </a>
                  <el-tag v-if="item.state === '2'" size="mini" type="danger">置顶</el-tag>
                </div>
                <div class="article-comment-replay" v-if="item.parentContent !== null && item.parentContent !== ''">
                  <span>回复：{{item.parentContent}}</span>
                </div>
                <div class="article-comment-content">
                  {{item.content}}
                </div>
                <div class="article-comment-action">
                  <span>{{item.createTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                  <span class="item-replay-btn" @click="onReplayClick(index, item.userName)">回复</span>
                </div>
                <div class="article-sub-comment-box clear-fix" style="display: none" :id="'sub_comment_input_'+index">
                  <div class="sub-comment-input float-left">
                    <img v-if="userInfo !== null" :src="userInfo.avatar" class="comment-user-avatar"/>
                    <img v-else class="comment-user-avatar"/>
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
                    <el-button type="primary" size="small" @click="doSubComment(item.content)">回复</el-button>
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
              <div class="article-company"><span>无业游民</span>@<span>地球村</span></div>
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
import 'highlight.js/styles/idea.css';
import Catelog  from '../../utils/headerLineHandler'
let lastInputBox = null;
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
      isImageDialogShow:false,
      targetImagePath:'',
      userInfo:null,
      comment:{
        content:'',
        articleId:'',
        parentContent:'',
      },
      subComment:'',
      currentPage:1,
      pageSize:5,
      subCommentPlaceholder:'回复',
      isArticleProcessing:true,
    }
  },
  async asyncData({params}){
    let articleRes = await Api.getArticleDetailById(params.id);
    let recommendArticleRes = await Api.getRecommendArticles(params.id, 10);
    //加載第一页评论数据
    let commentRes = await Api.getCommentsByArticleId(params.id, 1, 5);
    let labels = '';
    articleRes.data.labelList.forEach((label,index)=>{
      labels+=',';
      labels+=label;
    })
    return {
      article: articleRes.data,
      recommendArticles: recommendArticleRes.data,
      commentList:commentRes.data.contents,
      isLastPage: commentRes.data.last,
      labelList: labels
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
    },1000);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  methods:{
    scrollInToComment(){
      let commentInputBox = document.getElementById('article-comment-input');
      if (commentInputBox) {
        commentInputBox.scrollIntoView({
          block: "start",
          behavior:"smooth"
        })
      }
    },
    doSubComment(parentContent){
      if (this.subComment === '') {
        this.$message.error('评论内容不能为空');
        return;
      }
      this.comment.content = this.subComment;
      this.comment.parentContent = parentContent;
      this.comment.articleId = this.article.id;
      Api.postComment(this.comment).then(result=>{
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
    onReplayClick(index, userName){
      let subInputBox = document.getElementById('sub_comment_input_'+index);
      this.subComment = '';
      this.subCommentPlaceholder = '回复@' +userName;
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
          this.commentList = this.commentList.concat(result.data.contents);
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
          this.commentList = result.data.contents;
          this.currentPage = page;
        }
      })
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
      let parentPart = document.getElementById('article-box');
      if (catalogBox) {
        let bottomOfWC = userInfoBox.offsetTop + userInfoBox.offsetHeight;
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
.sub-comment-input {
  width: 600px;
  margin-left: 40px;
  margin-right: 40px;
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
  padding: 10px;
  background: #f5f5f5;
  margin-left: 30px;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;
  overflow: hidden;
}
.article-comment-content{
  padding: 10px;
  margin-left: 30px;
}
.item-replay-btn:hover{
  color: #3377ff;
}
.item-replay-btn{
  cursor: pointer;
}
.article-comment-action{
  color: #b2bac2;
  text-align: right;
  margin-right: 50px;
}
.comment-item-list{
  margin-top: 10px;
}
.comment-user-name{
  font-weight: 600;
  color: #b2bac2;
  font-size: 14px;
  line-height: 30px;
  margin-left: 5px;
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
  padding: 0 20px 0 20px;
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
  width: 710px;
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
.article-left-part{
  width: 820px;
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
  color: #333!important;
  line-height: 28px;
  font-size: 14px;
}
.article-content img{
  max-width: 780px;
  padding: 10px 0;
  cursor: zoom-in;
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
  color: #93999f;
  line-height: 40px;
  padding: 12px 0;
}

.article-content h2{
  color: #93999f;
  line-height: 36px;
  padding: 12px 0;
}

.article-content ul{
  margin-left: 20px;
}

.article-content .hljs {
  display: block;
  background: #f0f0f0 !important;
  border-radius: 2px;
  font: 14px/20px "Microsoft YaHei",Arial,Sans-Serif;
}
.article-content pre{
  max-height: 700px;
  overflow-y: scroll;
  padding: 10px 0;
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
</style>
