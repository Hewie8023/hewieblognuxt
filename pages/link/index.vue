<template>
  <div id="main-content">
    <div class="friends-list">
      <div class="link-title">友情链接</div>
      <div class="friends-link-list-container clear-fix">
        <div class="link-item float-left" v-for="(item,index) in friendLinks" :key="index">
          <el-tooltip effect="dark" :content="item.name" placement="top">
            <a :href="item.url">
              <img :src="item.logo"/>
            </a>
          </el-tooltip>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from '../../api/api'
export default {
  head() {
    return {
      titleTemplate: '幸运两小只-友情链接',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，友情链接' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  async asyncData({ params }) {
    let friendLinksRes = await Api.getLinks();
    return {
      friendLinks: friendLinksRes.data,
    }
  },
  mounted() {
    this.$store.commit("setCurrentActivityTab", "link");
  }
}
</script>

<style>

#main-content {
  width: 1140px;
  margin: 0 auto;
}

.friends-list {
  margin-top: 20px;
  background: #fff;
  margin-left: 2px;
  padding-bottom: 40px;
  border-radius: 6px;
}
.link-title {
  padding: 20px;
  line-height: 30px;
  font-size: 24px;
  text-align: center;
}

.link-item{

  border: #f5f5f5 solid 1px;
  padding: 10px;
  margin: 10px;
  width: 199px;
  text-align: center;
}
.link-item:hover{
  border: #0084ff solid 1px;
}

.link-item img{
  width: 150px;
  height: 56px;
  vertical-align: middle;
}

.friends-link-list-container {
  padding: 20px;
}
  .clear-fix {
    display: block;
    *zoom: 1;
  }
</style>
