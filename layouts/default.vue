<template>
  <div id="blog-box">
    <div id="blog-header" class="blog-header">
      <div class="header-center-part clear-fix">
        <div class="logo-box float-left">
          <a href="/">幸运两小只</a>
        </div>
        <div class="navigation-bar float-left">
          <NuxtLink to="/">
            <span :class="$store.state.currentActivityTab === 'index'?'header-active':'header-normal'">Hello·world</span>
          </NuxtLink>
          <NuxtLink to="/about">
            <span :class="$store.state.currentActivityTab === 'about'?'header-active':'header-normal'">关于</span>
          </NuxtLink>
          <NuxtLink to="/link">
            <span :class="$store.state.currentActivityTab === 'link'?'header-active':'header-normal'">友链</span>
          </NuxtLink>

        </div>
        <div class="header-search-part">
          <input id="search-input" @keyup.enter="toSearchPage" placeholder="有什么你想搜索的吗？" v-model="keywords"></input>
          <span id="search-icon-container">
            <i @click="toSearchPage" class="el-icon-search"></i>
          </span>
        </div>
        <div class="header-right-part">
          <div id="user-info-box" style="display: none" class="user-info-box float-left clear-fix">
            <div class="header-user-username float-right" v-if="userInfo !== null">
              <el-dropdown @command="handleCommand">
                <a :href="'/u/'+userInfo.id" target="_blank">个人中心 </a>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="admin" v-if="userInfo.roles === 'role_admin'">管理中心</el-dropdown-item>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              ·

              <a href="/post" target="_blank"> 发表文章</a>
            </div>
          </div>
          <div id="login-text-box" style="display: none" class="login-text-box">
            <span>
              <a :href="'/login'+redirectPath">
                <i class="hewieblog hewiefingermap"> </i> 登录
              </a>
            </span>
            <span>
              <a href="/register">
                <i class="hewieblog hewiemembers-add"> </i> 注册
              </a>
            </span>
          </div>
        </div>
      </div>

    </div>
    <Nuxt/>
    <div id="footer-container">
      <div class="blog-footer">
        <div class="foot-content">
          <p class="foot-copy-right">
      Copyright ©
            <a href="https://www.lucky-dogs.top" target="_blank">幸运两小只</a>
            (2021 - <span>{{currentYear}}</span>） 本网站由  •  鑫  ♥  娇  •  用爱驱动
          </p>
          <p class="foot-web-info">
            <a href="/about#关于网站" target="_blank">关于我们</a>
            |
            <a href="/about#联系我们" target="_blank">联系我们</a>
            |
            <a href="/link" target="_blank">友情链接</a>
          </p>
          <p class="foot-icp">
            <a  href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2021026669号</a>
          </p>
        </div>
      </div>
      <div id="g-to-top" class="g-to-top" style="display: none" @click="toTop">
        <i class="hewieblog hewietop" ></i>
      </div>
      <div id="wechat" class="wechat">
        <el-popover
          placement="left"
          width="200"
          trigger="hover">
          <el-image fit="cover" src="https://www.lucky-dogs.top/portal/image/1631198735305_885657217238302720.jpeg" ></el-image>
          <i slot="reference" class="hewieblog hewiewechat"></i>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../api/api'
export default {
  name: "default.vue",
  data(){
    return{
      keywords:'',
      userInfo:null,
      redirectPath:'',
      currentYear:'',
    }
  },
  mounted() {
    let data = new Date();
    this.currentYear = data.getFullYear();
    if (this.redirectPath !== '?redirect=' + location.href &&
      this.$route.path !== '/' &&
      this.$route.path !== '/login' &&
      this.$route.path !== '/register' &&
      this.$route.path !== '/forget') {
      //排除
      //登錄、首頁

      this.redirectPath = '?redirect=' + location.href
    }
    this.checkToken();
    //console.log(this.$store.state.currentActivityTab)
    //this.$store.commit("setCurrentActivityTab", "about");
    window.addEventListener("scroll", this.onWindowScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onWindowScroll);
  },

  methods:{

    toTop(){
      document.documentElement.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    onWindowScroll(){
      let offTop = document.documentElement.scrollTop;
      let toTopBox = document.getElementById('g-to-top');
      if (offTop > 100) {
        toTopBox.style.display='block'
      } else {
        toTopBox.style.display='none'
      }
    },
    toSearchPage(){
      this.keywords = this.keywords.trim();
      if (this.keywords.trim()==='') {
        this.$message.error("查询关键字不能为空")
        return;
      }
      //跳转到搜索页
      // this.$router.push({
      //   path:'/search',
      //   query:{
      //     keywords:encodeURIComponent(this.keywords),
      //     page:1,
      //     size:10,
      //     categoryId:'',
      //     sort:''
      //   }
      // })
      location.href = "/search?keyword=" + encodeURIComponent(this.keywords);
    },
    checkToken(){
      Api.checkToken().then(result=>{
        let loginText = document.getElementById('login-text-box');
        let loginSuccess = document.getElementById('user-info-box');
        if (result.code === Api.success_code) {
          this.userInfo = result.data;
          //通过状态树来共享id信息
          this.$store.commit("setCurrentUserId", this.userInfo.id);

          //console.log(this.userInfo)
          if (loginSuccess) {
            loginSuccess.style.display = 'block';
          }
        } else {
          if (loginText) {
            loginText.style.display = 'block';
          }
        }
      })
    },
    handleCommand(command){
      if (command === 'userInfo') {
        location.href = '/u/' + this.userInfo.id
      } else if (command === 'logout') {
        Api.doLogout().then(result=>{
          if (result.code === Api.success_code) {
            location.href = '/login'
          } else {
            this.$message.error(result.message)
          }
        })
      } else if (command === 'admin'){
        location.href = 'https://mp.lucky-dogs.top/#/index'
      }
    }
  }
}
</script>

<style>
#g-to-top{
  position: fixed;
  right: 50px;
  bottom: 140px;
  cursor: pointer;

}
#g-to-top i:hover{
  color: #3377ff;
}
#g-to-top i{
  font-size: 30px;
  font-weight: 600;
  color: #b2bac2;
}

#wechat i:hover{
  color: #67c23a;
}
#wechat i{
  font-size: 30px;
  font-weight: 600;
  color: #b2bac2;
}
#wechat{
  position: fixed;
  right: 50px;
  bottom: 100px;
  cursor: pointer;
}
  *{
    padding: 0;
    margin: 0;
    font-family: webfont-normal,DINRegular;
    text-decoration: none;

  }
  body{
    background: #f1f2f8;
  }
  #blog-box{
    width: 100%;
    height: 100%;
  }
  .float-left{
    float: left;
  }
  .float-right{
    float: right;
  }
  .clear-fix{
    overflow: hidden;
    zoom: 1;
  }
  .blog-header{
    background: #fff;
    color: #7f828b;
    margin-bottom: 20px;
  }
  .header-center-part{
    height: 61px;
    width: 1140px;
    color: #7f828b;
    margin: 0 auto;
  }

  .logo-box{
    float: left;
    text-decoration: none;
    line-height: 61px;
    color: #37f;
    font-size: 34px;
  }
  .logo-box a{
    text-decoration: none;
    color: #37f;
  }

  .navigation-bar{
    margin-left: 30px;
    line-height: 61px;
  }

  .navigation-bar span{
    margin-left: 30px;
    cursor: pointer;
    color: #7f828b;
  }
  .header-active{
    color: #0084ff !important;
  }
  .header-normal{
    color: #7f828b;
  }
  .navigation-bar span:hover{
    color: #0084ff;
  }

  .header-right-part{
    float: right;
    line-height: 61px;
  }
.header-user-username a{
  text-decoration: none;
  color: #909090;
  font-size: 14px;
}
  .login-text-box{
    line-height: 61px;
  }
  .login-text-box a {
    color: #7f828b;
    text-decoration: none;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .login-text-box span {
    line-height: 44px;
    margin-left: 5px;
    opacity: .9;
    cursor: pointer;
    margin-right: 5px;
  }

  .hewieblog {
    font-family: "hewieblog"!important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #footer-container{
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .blog-footer{
    width: 1140px;
    margin: 0 auto;
  }

  .foot-content{
    color: #909090;
    text-align: center;
  }
  .foot-copy-right{
    margin-bottom: 10px;
  }
  .foot-web-info{

  }
  .foot-content a {
    text-decoration: none;
    color: #909090;
  }
  .blog-footer a:hover{
    color: #1c90fd;
  }
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  *, :after, :before {
    box-sizing: border-box;
    margin: 0;
  }

  .header-search-part{
    float: left;
    line-height: 31px;
    height: 33px;
    margin-top: 15px;
    border-radius: 4px;
    margin-left: 30px;
    border: 1px solid hsla(0,0%,59.2%,.2);
    position: relative;
    background-color: #f9fafb;
  }
  .header-search-part input {
    height: 31px;
    line-height: 31px;
    float: left;
    padding-left: 16px;
    border: none;
    width: 200px;
    -webkit-appearance: none;
    box-sizing: border-box;
    color: #7f828b;
    display: inline-block;
    font-size: 13px;
    outline: 0;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  #search-icon-container {
    cursor: pointer;
    text-align: center;
    position: relative;
    width: 40px;
    float: left;
    display: block;
    margin-top: 8px;
    background: #fff;
  }
  #search-icon-container>i {
    left: 14px;
    color: #7f828b;
    position: absolute;
  }
  .header-user-avatar img{
    height: 36px;
    width: 36px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .header-user-username .header-user-username-link{
    font-size: 14px;
    font-weight: 600;
    color: #93999f;
    margin-left: 10px;
    vertical-align: middle;
    cursor: pointer;
  }
  .header-user-info{
    margin-right: 40px;
  }

  .el-dropdown-menu{
    border:none !important;
    box-shadow:none !important;
    border-radius:unset !important;
  }

  .el-popper[x-placement^=bottom] {
    margin-top: -2px;
  }
  .el-dropdown-menu__item{
    color: #93999f;
  }

html::-webkit-scrollbar {
  width: 8px;
  height: 6px;
}
html::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #cbcbcb;
}
html::-webkit-scrollbar-thumb:hover {
  background-color: #3377ff;
}
html::-webkit-scrollbar-track-piece {
  background: #eee;
}
</style>
