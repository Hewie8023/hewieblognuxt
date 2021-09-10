<template>
  <div id="main-content">
    <div id="home-content" class="home-content clear-fix">
      <div id="home-left-part">
        <div class="home-left-categories border-radius-default">
          <div :class="currentCategoryId===item.id?'home-left-item active':'home-left-item'" v-for="(item,index) in categories" :key="index">
            <div><span v-text="item.name" @click="listArticleByCategoryId(item)"></span></div>
          </div>
        </div>
<!--        <div id="scroll-top" title="回到顶部" class="scroll-top" style="display: block;">
          <a href="#top">
            <i class="hewieblog hewietop1" style="font-size: 24px;font-weight: 600"></i>
          </a>
        </div>-->
      </div>
      <div id="home-center-part" class="home-center-part">
        <div class="home-loop-part border-radius-default">
          <div class="home-loop">
            <el-carousel  :interval="3000">
              <el-carousel-item v-for="(item,index) in loops" :key="'loop-'+index">
                <a :href="item.url" target="_blank">
                  <img :src="item.imageUrl" style="object-fit: cover;"/>
                </a>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div v-loading="loading" class="home-center-content-list border-radius-default">
          <div>
            <div class="main-list-item" v-for="(item,index) in topArticles" :key="'top-'+index">
              <div class="top-article-item clear-fix" >
                <div class="img-container" >
                  <img :src="'/portal/image/'+ item.cover" class="el-image" style="width: 120px; border-radius: 4px; height: 80px; background: rgb(240, 240, 240); object-fit: cover;"/>
                </div>
                <div class="right-side">
                  <div class="title">
                    <div class="float-left"  style="display: inline-block">
                      <a :href="'/article/'+item.id" target="_blank">{{item.title}}</a>
                      <i class="hewieblog hewietop01 top"></i>
                    </div>
                    <div class="float-right" style="display: inline-block">
                      <span class="labels-item el-tag el-tag--mini el-tag--light float-right" v-for="(subItem,subIndex) in item.labelList" :key="'top-label-' + subIndex">
                        <a :href="'/search?keyword=' + subItem" target="_blank">
                          {{ subItem }}
                        </a>
                      </span>
                    </div>

                  </div>
                  <div class="item-info">
                    <el-tag style="cursor: pointer" type="success">{{item.category.name}}</el-tag>
                    <a target="_blank" :href="'/u/'+item.hewieUserNoPassword.id" :title="item.hewieUserNoPassword.userName">
                        <img :src="item.hewieUserNoPassword.avatar" style="width: 20px; height: 20px; border-radius: 50%; margin-bottom: -5px; margin-left: 5px; margin-right: 2px;">
                      <el-tooltip size="small" class="item" effect="dark" :content="item.hewieUserNoPassword.userName" placement="top-end">
                      <span class="vip-red-name content-item-username">
                          {{ item.hewieUserNoPassword.userName }}
                        </span>
                      </el-tooltip>
                    </a>
                    <span>  ·  </span>
                    <span>{{item.updateTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                    <span>  ·  </span>
                    <i class="el-icon-view"></i>
                    <span>{{ item.viewCount }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="main-list-item" v-for="(item,index) in articles.contents" :key="'article-'+index">
              <div class="one-img-container clear-fix">
                <div class="img-container">
                  <img :src="'/portal/image/'+ item.cover" class="el-image" style="width: 120px; border-radius: 4px; height: 80px; background: rgb(240, 240, 240); object-fit: cover;"/>
                </div>
                <div class="right-side">
                  <div class="title">
                    <a :href="'/article/'+item.id" target="_blank">{{item.title}}</a>
                    <span class="labels-item el-tag el-tag--mini el-tag--light float-right" v-for="(subItem,subIndex) in item.labelList" :key="'article-label-'+subIndex">
                        <a :href="'/search?keyword=' + subItem" target="_blank">
                          {{ subItem }}
                        </a>
                      </span>
                  </div>
                  <div class="item-info">
                    <el-tag style="cursor: pointer" type="success">{{item.category.name}}</el-tag>
                    <a target="_blank" :href="'/u/'+item.hewieUserNoPassword.id" :title="item.hewieUserNoPassword.userName">
                      <img :src="item.hewieUserNoPassword.avatar" style="width: 20px; height: 20px; border-radius: 50%; margin-bottom: -5px; margin-left: 5px; margin-right: 2px;">
                      <el-tooltip size="small" class="item" effect="dark" :content="item.hewieUserNoPassword.userName" placement="top-end">
                        <span class="vip-red-name content-item-username">
                            {{ item.hewieUserNoPassword.userName }}
                          </span>
                      </el-tooltip>
                    </a>
                    <span>·</span>
                    <span >{{item.updateTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                    <span>·</span>
                    <i class="el-icon-view"></i>
                    <span>{{ item.viewCount }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="page-navigation">
          <el-pagination
            class="page-navigation-bar"
            background
            @current-change="onPageChange"
            :current-page="pageNavigation.currentPage"
            :page-size="pageNavigation.pageSize"
            layout="prev, pager, next"
            :total="pageNavigation.totalCount">
          </el-pagination>
        </div>
      </div>
      <div class="home-right-part">
        <div class="right-login-success border-radius-default" >
          <div class="user-info-content" v-if="loginUserInfo !== ''">
            <div class="user-info-back" style="height: 50px; background: rgb(0, 132, 255);"></div>
            <div>
              <div class="user-avatar">
                <img :src="loginUserInfo.avatar" style="object-fit: cover;">
              </div>
              <div class="user-name">
                <span v-text="loginUserInfo.userName"></span>
              </div>
              <div class="user-sign">
                <span v-text="loginUserInfo.sign"></span>
              </div>
            </div>
          </div>
          <div class="no-login" v-else>
            <div class="login-tips">
              登录以后您可以发表文章，评论，发表动态等。。。
            </div>
            <el-button @click="doLogin" class="login-btn" type="primary" size="mini">点我登录</el-button>
          </div>
        </div>
        <div id="tags-card" class="right-card border-radius-default">
          <div class="card-title">热门标签</div>
          <div class="tag-list-box">
            <LabelCloud></LabelCloud>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../api/api'

export default {
  head() {
    return {
      titleTemplate: '幸运两小只',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，技术分享博客，主要包括JavaWeb开发、前端、文章读后感' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  data(){
    return {
      loading:false,
      currentCategoryId:'',
      loginUserInfo:'',
    }
  },
  async asyncData({ params }) {
    let userInfoRes = await Api.getUserInfo("868509148860383233");
    let categoriesRes = await Api.getCategories();
    let loopsRes = await Api.getloops();
    let topArticleRes = await Api.getTopArticles();
    let articleRes = await Api.getArticles('', 1,30);
    let pageNavigation = {
      currentPage:articleRes.data.currentPage,
      totalCount:articleRes.data.totalCount,
      pageSize:articleRes.data.pageSize
    }
    let tmpCategories = [];
    tmpCategories.push({
      name:'推荐',
      id:''
    })
    tmpCategories = tmpCategories.concat(categoriesRes.data);
    return {
      pageNavigation: pageNavigation,
      articles:articleRes.data,
      topArticles:topArticleRes.data,
      loops:loopsRes.data,
      userInfo:userInfoRes.data,
      categories:tmpCategories
    }
  },
  methods:{
    doLogin(){
      location.href="/login"
    },
    handleArticleResult(result){
      if (result.code === Api.success_code){
        this.articles = result.data;
        //回到顶部
        let topHeader = document.getElementById('blog-header');
        if (topHeader) {
          topHeader.scrollIntoView({
            block: "start",
            behavior:"smooth"
          })
        }

        this.pageNavigation.currentPage = result.data.currentPage;
        this.pageNavigation.totalCount = result.data.totalCount;
        this.pageNavigation.pageSize = result.data.pageSize;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    onPageChange(page){
      this.loading = true;
      //加载当前页内容发
      Api.getArticles(this.currentCategoryId, page, this.pageNavigation.pageSize).then(result=>{
        this.handleArticleResult(result)
      })
    },

    listLabels(){
      Api.getLabels(20).then(result=>{
        if(result.code === Api.success_code) {
          this.labels = result.data.content;
        } else {
          this.$message.error(result.data);
        }
      })
    },
    onWindowScroll(){
      let scrolledTop =  document.documentElement.scrollTop;
      let scrolledLeft =  document.documentElement.scrollLeft;
      let leftPart = document.getElementById('home-left-part');
      let centerPart = document.getElementById('home-center-part');
      let parentPart = document.getElementById('home-content');
      //左边内容悬浮
      if (centerPart && leftPart && parentPart) {
        //处理上下滑动
        let baseTop = centerPart.offsetTop;
        if (scrolledTop <= baseTop) {
          leftPart.style.top = (baseTop - scrolledTop) + 'px';
        } else {
          leftPart.style.top =  '20px';
        }
        //处理左右
        if (scrolledLeft > 0) {
          leftPart.style.left = -scrolledLeft + 'px';
        } else {
          leftPart.style.left = parentPart.style.left
          //leftPart.style.left = parentPart.offsetLeft + 'px'
        }
      }
      //右边内容悬浮
      let tagsPart = document.getElementById('tags-card');
      if (tagsPart) {
        let bottomOfTags = tagsPart.offsetTop + tagsPart.offsetHeight;
        if (scrolledTop >= bottomOfTags) {
          tagsPart.style.position = 'fixed';
          tagsPart.style.top = '20px';
          tagsPart.style.width = '300px';
        } else {
          tagsPart.style.position = '';
          tagsPart.style.top = '';
        }

        //处理左右
        if (scrolledLeft > 0) {
          tagsPart.style.left = parentPart.offsetWidth + parentPart.offsetLeft - scrolledLeft - tagsPart.offsetWidth + 'px';
        } else {
          tagsPart.style.left = parentPart.offsetWidth + parentPart.offsetLeft - tagsPart.offsetWidth + 'px';
          //leftPart.style.left = parentPart.offsetLeft + 'px'
        }
      }
    },
    listArticleByCategoryId(item){
      if (this.currentCategoryId === item.id) {
        return;
      }
      this.loading = true;
      //重置页码
      this.pageNavigation.currentPage = 1;
      this.currentCategoryId = item.id;
      //请求数据
      Api.getArticles(this.currentCategoryId, this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result=>{
        this.handleArticleResult(result)
      })
      //处理结果
    },
    checkToken(){
      Api.checkToken().then(result=>{
        if (result.code === Api.success_code) {
          this.loginUserInfo = result.data;
          console.log("userInfo===>"+this.loginUserInfo)
        }else {
          console.log("userInfo=00==>"+this.loginUserInfo)
        }
      })
    },
  },
  mounted() {
    this.checkToken();
    console.log("loginUserInfo"+this.loginUserInfo)
    this.$store.commit("setCurrentActivityTab", "index");
    this.listLabels();
    window.addEventListener('scroll', this.onWindowScroll);
    let that = this;
    window.onresize = function () {
      that.onWindowScroll();
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  }
}
</script>

<style>

.main-list-item .labels-item a:hover{
  color: #37f !important;
}

.main-list-item .labels-item a{
  color: #a1a1a2 !important;
  font-size: 12px !important;
  font-weight: 200 !important;
  line-height: 20px !important;
  padding: 0 10px;
}

.main-list-item .title .el-tag{
  background:#f3f2f4;
  border-style: none;
  border-width: 0ch;
  padding: 0;
}

#home-left-part{
  position: fixed;
  top:81px;
}

  #main-content{
    width: 1140px;
    margin: 0 auto;
  }

  #size-info{
    margin-bottom: 20px;
  }

  .size-info-title{
    text-align: center;
    color: #909090;
    font-size: 16px;
  }

  .follow-way {
    margin-top: 10px;
    text-align: center;
  }

#tags-card .wordCloud{
  height: 250px !important;
}

  .wordCloud .text {
    cursor: pointer;
  }

  .wechat-img{
    text-align: center;
  }
  .wechat-img img{
    object-fit: cover;
    width: 250px;
    height: 250px;
  }

  .clear-fix {
    display: block;
    *zoom: 1;
  }
  #home-left-part {
    position: fixed;
    width: 150px;
    float: left;
  }
  .home-left-categories {
    width: 140px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-right: 10px;
    background: #fff;
  }
  .border-radius-default {
    border-radius: 6px;
  }
  .home-left-item {
    text-align: center;
    line-height: 26px;
    color: #909090;
    border-radius: 4px;
    font-size: 14px;
    margin: 4px 10px;
    padding: 4px 0;
    cursor: pointer;
  }

  .home-left-item:hover{
    background: rgba(51,119,255,.1);
  }
  .home-left-categories .active {
    background: rgba(51,119,255,.1);
    color: #37f;
    font-weight: 600;
  }
  .scroll-top {
    padding-top: 20px;
    margin-right: 10px;
    padding-bottom: 10px;
    text-align: center;
  }
  .home-center-part {
    margin-left: 160px;
    margin-bottom: 30px;
    width: 660px;
    margin-right: 10px;
    float: left;
  }
  .home-loop-part {
    margin-bottom: 20px;
    background: #f3f3f3;
    border-radius: 6px;
    height: 200px;
  }

  .home-loop{
    height: 200px;
  }


  .home-loop-part img{
    width: 100%;
    border-radius: 6px;
    cursor: pointer;
    height: 200px;
  }

  .home-loop-part .el-carousel__button{
    width: 8px;
    height: 8px;
  }

  .home-loop-part .el-carousel__item{
    border-radius: 6px;
  }

  .home-loop-part .el-carousel__container{
    height: 200px;
  }

  .home-center-content-list {
    margin-top: 20px;
    background: #fff;
    padding: 20px;
    margin-bottom: 20px;
  }
  .main-list-item {
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f3f3f3;
  }


  .one-img-container .img-container, .top-article-item .img-container {
    float: left;
  }
  .el-image {
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  img {
    vertical-align: middle!important;
  }
  .one-img-container .right-side , .top-article-item .right-side{
    float: left;
    margin-left: 20px;
    width: 480px;
  }

  .top-article-item .right-side .title .top{
    font-size: 22px;
    color: red;
    font-weight: 600;

  }

  .one-img-container .right-side .title, .top-article-item .right-side .title {
    max-width: 480px;
    margin-top: 5px;
    margin-bottom: 16px;
    margin-right: 20px;

    overflow: hidden;
  }

  .one-img-container .right-side .title span, .top-article-item .right-side .title span{
    margin-left:20px ;
    cursor: pointer;
  }

  .main-list-item .item-info, .main-list-item .item-info a {
    font-size: 14px;
    color: #777;
  }


  .main-list-item .title a {
    font-weight: 600;
    font-size: 16px;
    color: #47494e;
    line-height: 30px;
  }

  .main-list-item .title a:hover {
    color: #3377ff;
  }

  .main-list-item a {
    text-decoration: none;
  }

  .content-item-username {
    font-weight: 600!important;
    color: #666;
    font-size: 13px;
  }

  .home-right-part {
    width: 300px;
    margin-left: 10px;
    float: left;
  }

  .right-login-success{
    padding: 10px;
    width: 100%;
    margin-bottom: 20px;
    background: #fff
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

  .right-card .tag-list-box{
    height: 250px;
  }

  .user-info-content{
    text-align: center;
    width: 100%;
    background: #fcfcfc;
    position: relative;
  }

  .user-info-content .user-avatar{
    position: absolute;
    border-radius: 26px;
    margin-left: -25px;
    left: 50%;
    background: #f3f3f3;
    top: 20px;
  }

  .user-info-content .user-avatar img{
    width: 47px;
    height: 47px;
    border-radius: 50%;
  }

  .user-info-content .user-info-back{
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
  }

  .user-info-content .user-name{
    margin-top: 30px;
    font-size: 18px;
    font-weight: 600;
    color: #7f828b;
  }

  .user-info-content .user-sign{
    margin-top: 10px;
    color: #7f828b;
    font-size: 14px;
    margin-bottom: 20px;
  }


  .home-center-part .page-navigation{
    text-align: center;
  }
  .home-center-part .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
    background-color: #fff;
  }

  .no-login{
    width: 100%;
    padding: 20px;
    display: block;
    background: #fff;
  }
  .no-login .login-tips{
    font-size: 13px;
    line-height: 17px;
    text-align: center;
    color: #777;
  }
  .no-login .login-btn{
    margin-top: 20px;
    text-align: center;
  }
  .no-login .el-button{
    width: 240px;
  }
</style>
