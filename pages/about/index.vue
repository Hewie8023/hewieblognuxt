<template>
  <div class="about-page-box clear-fix" id="about-page-box">
    <div class="about-left-part float-left" id="about-left-part">
      <el-tabs tab-position="left" v-model="target" @tab-click="onLeftItemClick">
        <el-tab-pane label="关于网站" name="关于网站"></el-tab-pane>
        <el-tab-pane label="网站使命" name="网站使命"></el-tab-pane>
        <el-tab-pane label="网站愿景" name="网站愿景"></el-tab-pane>
        <el-tab-pane label="联系我们" name="联系我们"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="about-right-part float-left" id="about-right-part">
      <div class="about-item">
        <h1 id="关于网站">关于网站</h1>
        <p>
          萌萌哒的本站创立于2021年，那是一个阳光明媚的下午。
          这是属于学习，写博客，写笔记，分享经验，提问题，分享链接的笔记本。你可以遇到志同道合的人，收获知识、经验与同性朋友。
          最初的目的：写一个属于自己的博客，记录自己日常，或者是分享自己学习的心得，又或者通过写博客，而学习更多的知识。
          萌萌哒的本站创立于2021年，那是一个阳光明媚的下午。
          这是属于学习，写博客，写笔记，分享经验，提问题，分享链接的笔记本。你可以遇到志同道合的人，收获知识、经验与同性朋友。
          最初的目的：写一个属于自己的博客，记录自己日常，或者是分享自己学习的心得，又或者通过写博客，而学习更多的知识。

        </p>
      </div>
      <div class="about-item">
        <h1 id="网站使命">网站使命</h1>
        <p>
          希望分享的文章能帮助到更多的小伙伴，结交更多的朋友。

          萌萌哒的本站创立于2021年，那是一个阳光明媚的下午。
          这是属于学习，写博客，写笔记，分享经验，提问题，分享链接的笔记本。你可以遇到志同道合的人，收获知识、经验与同性朋友。
          最初的目的：写一个属于自己的博客，记录自己日常，或者是分享自己学习的心得，又或者通过写博客，而学习更多的知识。
          萌萌哒的本站创立于2021年，那是一个阳光明媚的下午。
          这是属于学习，写博客，写笔记，分享经验，提问题，分享链接的笔记本。你可以遇到志同道合的人，收获知识、经验与同性朋友。
          最初的目的：写一个属于自己的博客，记录自己日常，或者是分享自己学习的心得，又或者通过写博客，而学习更多的知识。
        </p>
      </div>
      <div class="about-item">
        <h1 id="网站愿景">网站愿景</h1>
        <p>
          让每一个热爱编程的年轻人成为优秀的程序员(媛)。

          萌萌哒的本站创立于2021年，那是一个阳光明媚的下午。
          这是属于学习，写博客，写笔记，分享经验，提问题，分享链接的笔记本。你可以遇到志同道合的人，收获知识、经验与同性朋友。
          最初的目的：写一个属于自己的博客，记录自己日常，或者是分享自己学习的心得，又或者通过写博客，而学习更多的知识。
        </p>
      </div>
      <div class="about-item">
        <h1 id="联系我们">联系我们</h1>
        <p class="contact">
          广告投放QQ-349545547
        <br>
          商务合作QQ-349545547
        <br>
          内容投诉QQ-349545547
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      titleTemplate: '幸运两小只-关于',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，关于网站' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  methods:{
    onWindowScroll(){
      let dy = document.documentElement.scrollTop;
      let dx = document.documentElement.scrollLeft;

      let leftBox = document.getElementById("about-left-part");
      let parentBox = document.getElementById("about-page-box");
      if (leftBox && parentBox) {
        let parentBoxTop = parentBox.offsetTop;
        if (dy > parentBoxTop) {
          leftBox.style.top='0px';
        } else {
          leftBox.style.top= (parentBoxTop - dy) + 'px';
        }

        if (dx > 0) {
          leftBox.style.left = -dx + 'px';
        } else {
          leftBox.style.left = parentBox.offsetLeft + 'px';
        }
        if (!this.isClickLeftSwitch) {
          //处理标签的滚动范围
          for (let i = 0; i < this.contentHeader.length - 1; i++) {
            let first = this.contentHeader[i];
            let second = this.contentHeader[i + 1];
            if (dy >= first.offTop && dy < second.offTop){
              this.target =  first.id;
              break;
            }
          }
        } else {
          this.isClickLeftSwitch = false;
        }

      }
    },
    onLeftItemClick(){
      this.isClickLeftSwitch = true;
      this.$router.push({
        path:'/about#'+this.target
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onWindowScroll);
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "about");
    window.addEventListener("scroll", this.onWindowScroll);
    let that = this;
    window.onresize = function (){
      that.onWindowScroll();
    }
    this.onWindowScroll();
    //处理内容部分的h1标签距离
    let aboutRightBox = document.getElementById("about-right-part");
    let h1List = aboutRightBox.querySelectorAll('h1');
    h1List.forEach(item=>{
      this.contentHeader.push({
        offTop:item.offsetTop,
        id:item.id
      })
      //console.log(item.id)
    })
  },
  data(){
    return{
      target: '关于网站',
      contentHeader:[],
      isClickLeftSwitch: false
    }
  }
}
</script>

<style>
#about-left-part{
  position: fixed;
}

.about-page-box{
  width: 1140px;
  margin: 20px auto;
  background: #ffffff;
}
.about-right-part .about-item {
  margin-top: 5px;
  margin-bottom: 80px;
  line-height: 30px;
  font-size: 16px;
}

.about-left-part .el-tabs__item{
  border-right:  1px dashed #b2bac2;
  transition: all .3s;
  color: #b2bac2;
  font-size: 16px;
  padding-top: 15px;
  padding-bottom: 15px;
  height: fit-content;
  transition: all .3s;
}
.about-left-part .el-tabs__nav{
  padding-right: 20px;

}
.about-left-part .el-tabs--left .el-tabs__header.is-left{
  margin-right: 0px;
}
.about-left-part .el-tabs__item.is-active{
  color: #3377ff;
  font-size: 18px;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 20px;
  transition: all .3s;
}
.about-left-part .el-tabs__item.is-active::after{
  content: " ";
  display: inline-block;
  position: absolute;
  right: -14px;
  top: 26px;
  width: 27px;
  height: 27px;
  border: 6px solid #50a7fc;
  border-radius: 50%;
  background-color: #fff;
  transform: scale(.8);
  transition: all .3s;
}
.about-left-part .el-tabs__nav-wrap::after{
  background: rgba(0,0,0,0);
}
.about-left-part .el-tabs__active-bar{
  width: 0 !important;
}
.about-left-part .el-tabs--left .el-tabs__header.is-left {
  float: none;
}
.about-left-part{
  width: 300px;
  min-height: 300px;

}

.about-right-part{
  width: 840px;
  margin-left: 300px;
}
</style>
