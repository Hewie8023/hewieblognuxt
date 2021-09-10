<template>
  <div id="search-main" class="search-box ">
    <div class="search-input-part">
      <div class="search-input-container clear-fix">
        <div class="search-input-logo float-left">
          <span class="logo">幸运两小只</span>
          <span> | </span>
          <span>搜搜</span>
        </div>
        <div class="search-input float-left">
          <el-input placeholder="要搜点啥呢~~~" v-model="keyword" @keyup.enter.native="toSearchPage"></el-input>
        </div>
        <div class="search-btn float-left">
          <el-button type="primary" icon="el-icon-search"  @click="toSearchPage">搜搜</el-button>
        </div>
      </div>
    </div>

    <div id="search-bottom-part" class="clear-fix">
      <div id="search-result-part" class="float-left">
        <div id="search-condition-box">
          <div class="search-condition clear-fix">
            <div class="select-item">
              <span :class="sort === ''?'sort-active':''" @click="doSearchBySort('')">综合排序</span>
              <span :class="sort === '2'?'sort-active':''" @click="doSearchBySort('2')">最新发布</span>
              <span :class="sort === '4'?'sort-active':''" @click="doSearchBySort('4')">最多浏览</span>
            </div>
            <div class="select-item">
              <span :class="categoryId === ''? 'category-active':''" @click="doSearchByCategory('')">全部分类</span>
              <span  :class="categoryId === item.id? 'category-active':''" v-for="item in categories" :key="item.id" @click="doSearchByCategory(item.id)">{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class="search-content-list" v-if="searchResult.totalCount > 0">
          <div class="search-result-count-box">
            <span class="search-result-count">共找到<span v-text="searchResult.totalCount"></span>个相关内容</span>
          </div>
          <div  class="search-content-item" v-for="(item,index) in searchResult.contents" :key="index">
            <div  class="type-article-share-wenda">
              <div class="clear-fix">
<!--                <img src="https://imgs.sunofbeaches.com/group1/M00/00/1F/rBsADV7H3OyAERStAABEGnDaVFM702.png" style="float: right;">-->
                <div style="clear: none;">
                  <a :href="'/article/'+item.id" target="_blank">
                    <span class="search-page-result-title" v-html="item.blogTitle"></span>
                  </a>
                  <div class="search-content-description" v-html="item.blogContent"></div>
                </div>
              </div>
              <div class="info-item">
                <span class="info-item-text" ><i class="hewieblog hewierili"></i>{{item.blogCreateTime | formatDate('yyyy-MM-dd hh:mm')}}</span>
                <span class="info-item-text" > <i class="hewieblog hewieview"></i>{{item.blogViewCount}}</span>
                <span class="info-item-text" v-for="(subItem, subIndex) in item.blogLabels" :key="subIndex">
                  <a href="#">{{ subItem }}</a>
                  <span v-if="subItem !== ''&& subIndex + 1 < item.blogLabels.length"> / </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="search-content-list">
          <div class="search-result-count-box">
            <span class="search-result-count">共找到<span v-text="searchResult.totalCount"></span>个相关内容</span>
          </div>
          <div class="none-result">
            <div class="hewieblog hewieemptybox"></div>
            <div class="empty-text">木有结果~ 搜搜其他的试试呗   ~~~^o^~~~</div>
          </div>
        </div>
        <div class="search-result-page-navigation clear-fix">
          <div class="search-pre float-left">
            <el-link :disabled="isFirst" :href="'/search?keyword='+ keyword +'&page='+(page-1)+'&size='+size+'&sort='+sort+'&categoryId='+categoryId" >&lt;&lt; 上一页</el-link>
          </div>
          <div class="search-next float-right">
            <el-link :disabled="isLast" :href="'/search?keyword='+ keyword +'&page='+(page+1)+'&size='+size+'&sort='+sort+'&categoryId='+categoryId" >下一页 &gt;&gt;</el-link>
          </div>
        </div>
      </div>
      <div id="search-right-part" class="float-left">
        <div class="tag-list-box">
          <LabelCloud></LabelCloud>
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
        titleTemplate: '幸运两小只-搜索',
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '幸运两小只博客，搜索中心' },
          { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
        ]
      }
    },
    async asyncData({query}) {


      let categoryId = query.categoryId ? query.categoryId : '';
      let keyword = query.keyword ? query.keyword : '';
      let page = query.page ? query.page : 1;
      let size = query.size ? query.size : 10;
      let sort = query.sort ? query.sort : '';

      let result = await Api.getSearchContent(categoryId, keyword,
                                  page, size, sort);
      let tmpResult = result.data;
      let contents = tmpResult.contents;
      contents.forEach(item=>{
        item.blogLabels = item.blogLabels.split('-')

      })

      let categoriesRes = await Api.getCategories();

      return{
        categories:categoriesRes.data,
        keyword:keyword,
        page:parseInt(page),
        size:parseInt(size),
        sort:sort,
        categoryId:categoryId,
        isFirst: tmpResult.first,
        isLast: tmpResult.last,
        searchResult: tmpResult,
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
          location.href = '/login?redirect='+location.href
        }
      },

      toSearchPage(){
        location.href = "/search?keyword=" + encodeURIComponent(this.keyword);
      },
      doSearchBySort(sort) {
        /*if (sort === '2' && this.sort === '2') {
          sort = '1';
        }

        if (sort === '4' && this.sort ===  '4') {
          sort = '3';
        }*/

        location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + sort + '&categoryId=' + this.categoryId;
      },
      doSearchByCategory(id) {
        location.href = "/search?keyword=" + encodeURIComponent(this.keyword) + '&sort=' + this.sort + '&categoryId=' + id;
      }
    }
  }
</script>

<style>

#search-right-part .wordCloud{
  height: 220px !important;
}

.tag-list-box{
  height: 260px;
  padding: 20px;
}

.sort-active, .category-active{
  background: #37f;
  color: #fff !important;
  border-radius: 6px;
}

.select-item span:hover{
  color: #37f;
}
.select-item span{
  margin-left: 8px;
  margin-right: 8px;
  padding: 5px 15px;
  margin-bottom: 12px;
  margin-top: 12px;
  cursor: pointer;
  color: #93999f;
  font-size: 14px;
}

.select-item{
  line-height: 24px;
  margin-bottom: 12px;
  margin-top: 12px;
}
.none-result{
  padding: 20px;
  height: 200px;
  color: #37f;
  text-align: center;
  line-height: 88px;
}

.none-result .empty-text{
  font-size: 20px;
}

.none-result .hewieemptybox{
  font-size: 70px;
}

.search-result-page-navigation{
  background: #fff;
  padding: 20px;
  box-shadow: 0 6px 10px 0 rgb(95 101 105 / 15%);
  border-radius: 6px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.search-result-page-navigation .search-next ,.search-result-page-navigation .search-pre{
  cursor: pointer;
  color: #7f828b;
  text-decoration: none;
}
.search-result-page-navigation span{
  font-size: 16px;
  font-weight: 600;
  font-family: webfont-normal,DINRegular;
}

.search-result-page-navigation .search-next:hover ,.search-result-page-navigation .search-pre:hover{
  color: #0084ff;
}

#search-result-part{
  width: 820px;
  margin-right: 20px;
}

#search-condition-box{
  padding: 5px;
  box-shadow: 0 6px 10px 0 rgb(95 101 105 / 15%);
  border-radius: 6px;
  margin-bottom: 20px;
  background: #fff;
  padding: 20px;

}

.search-result-count-box{
  display: inline-block !important;
  width: 100%;
  border-bottom: 1px solid #f3f3f3;
}

.search-content-list {
  box-shadow: 0 6px 10px 0 rgb(95 101 105 / 15%);
  border-radius: 6px;
  background: #fff;
  padding: 10px;

}

.search-input-container{
  display: inline-block !important;
  line-height: 40px;
}

.search-input-logo{
  color: #37f;
  font-size: 20px;
  margin-right: 20px;
}

.logo{
  font-size: 30px;
}

.search-input-part{
  width: 1140px;
  background: #fff;
  box-shadow: 0 6px 10px 0 rgb(95 101 105 / 15%);
  margin-bottom: 20px;
  border-radius: 6px;
  text-align: center;
  padding: 20px;
}

.search-input .el-input__inner {
  border-width: 2px;
}

.search-input{
  width: 250px;
  margin-right: 20px;
}

#search-right-part{
  width: 300px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 6px 10px 0 rgb(95 101 105 / 15%);
}

#search-main{
  width: 1140px;
  margin: 0 auto;
}

.search-box{
  margin-bottom: 20px;
}

.search-result-count {
  line-height: 30px;
  margin-left: 10px;
  float: left;
  font-size: 12px;
  color: #93999f;
}

.search-content-item, .search-content-item {
  padding: 20px 10px;
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.type-article-share-wenda {
  width: 100%;
}

.type-article-share-wenda img {
  width: 90px;
  height: 90px;
  vertical-align: middle;
  border-style: none;
  -o-object-fit: cover;
  object-fit: cover;
  margin-left: 20px;
  border-radius: 4px;
}

.type-article-share-wenda a {
  color: #0084ff;
}

.search-page-result-title {
  font-size: 20px;
  line-height: 1.3;
  margin-bottom: 5px;
  margin-top: 5px;
}

.search-content-description {
  line-height: 28px;
  margin-top: 8px;
  color: #545454;
  word-break: break-word;
  font-size: 14px;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.type-article-share-wenda .info-item {
  margin-top: 10px;
  color: #b2bac2;
  font-size: 14px;
}

.type-article-share-wenda .info-item a {
  color: #b2bac2;
}

.search-content-item {
  border-bottom: 1px solid rgba(178,186,194,.15);
}

.info-item-text{
  margin-right: 10px;
}

.info-item-text i{
  margin-right: 5px;
}
</style>
