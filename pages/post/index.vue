<template>
<div class="post-article-box">
  <div class="article-title-part">
    <el-input v-model="article.title" placeholder="请输入文章标题(8-64字符)" maxlength="64" minlength="8" show-word-limit></el-input>
  </div>
  <div class="article-handle-part">
    <no-ssr>
      <mavon-editor v-model="article.content"
                    ref="mdEitor"
                    @onImageClick="onEditorImageClick">
      </mavon-editor>
    </no-ssr>
  </div>
  <div class="article-post-setting-part">
    <el-form label-width="80px">
      <el-form-item label="文章分类" required>
        <el-select v-model="article.categoryId" placeholder="请选择文章类别" size="small">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="摘要" required>
        <el-input type="textarea" :row="3" placeholder="文章摘要" v-model="article.summary" size="small"></el-input>
      </el-form-item>
      <el-form-item label="封面" required>
        <div class="article-cover" @click="showCoverSelector">
          <i class="el-icon-plus" v-if="article.cover === '' || article.cover === 'null'"></i>
          <el-image fit="cover" v-else :src="'/portal/image/' + article.cover"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="标签"  class="label-input-box" required>
        <el-tag
          :key="tag"
          v-for="tag in labels"
          closable
          :disable-transitions="false"
          @close="deleteLabel(tag)" size="small">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-label"
          v-if="labelInputVisible"
          v-model="labelNewVal"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleLabelInputConfirm"
          @blur="showAddLabelBtn"
          placeholder="回车确认输入"
        >
        </el-input>
        <el-button v-if="!labelInputVisible && !isEnough" class="button-new-tag" size="small" @click="showLabelInput">+ 新标签</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="article-post-action-bar clear-fix">
    <div class="action-btn-container float-right">
      <el-button size="small" type="info" plain @click="preView">全屏预览</el-button>
      <el-button size="small" type="info" plain @click="saveArticleDraft" :disabled="disableDraftBtn===true">保存草稿</el-button>
      <el-button size="small" type="primary" @click="commitArticle">{{commitText}}</el-button>
    </div>
  </div>

  <div class="article-post-dialog-box">
    <el-dialog
      title="图片选择"
      :visible.sync="isImgSelectorShow"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="650px">
      <div class="image-selector-box">
        <div class="image-action-bar clear-fix">
          <div class="upload-btn">
            <el-upload
              class="upload-article-img"
              action="/admin/image/article"
              :show-file-list="false"
              :on-success="handleArticleImageSuccess"
              :on-error="onUploadImageError"
              accept="image/*">
              <el-button size="small"  type="primary">上传图片</el-button>
            </el-upload>
          </div>
          <div class="upload-tips">
            <span>图片大小不超过1M</span>
          </div>
        </div>
        <div class="image-selector-list clear-fix">
          <el-radio-group v-model="selectedImagePathIndex">
            <el-radio-button v-for="(item, index) in images" :key="index" :label="index" >
              <el-image fit="cover"  :src="'/portal/image/' + item.url" @dblclick="onImageSelect"></el-image>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="image-picker-navigation">
          <el-pagination
            class="image-page-navigation-bar"
            background
            @current-change="onPageChange"
            :current-page="pageNavigation.currentPage"
            :page-size="pageNavigation.pageSize"
            layout="prev, pager, next"
            :total="pageNavigation.totalCount">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="isImgSelectorShow = false">取 消</el-button>
          <el-button size="small" type="primary" @click="onImageSelect">选 择</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="确定要离开吗？"
      :visible.sync="saveConfirmDialogShow"
      width="400px"
      center>
      <span>系统可能不会保存填写的稿件信息噢...(´；ω；`)</span>
      <span slot="footer" class="dialog-footer">
                    <el-button size="small" @click="saveConfirmDialogShow = false">取 消</el-button>
                    <el-button size="small" type="primary" @click="toNextPage">确 定</el-button>
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
      titleTemplate: '幸运两小只-发表文章',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '幸运两小只博客，发表文章' },
        { hid: 'keywords', name: 'keywords', content: '幸运两小只,Java,前端,博客系统,程序员' }
      ]
    }
  },
  name: "index.vue",
  data(){
    return {
      commitText:'发表文章',
      article:{
        id:'',
        title:'',
        content: '',
        categoryId:'',
        summary:'',
        cover:'',
        labels: '',
        state:'1',
        type:'1',
      },
      imageSelectFor:'article',
      isImgSelectorShow: false,
      categoryList: [],
      labels:[],
      labelInputVisible: false,
      labelNewVal:'',
      isEnough: false,
      images:[],
      selectedImagePathIndex: 0,
      pageNavigation: {
        currentPage: 1,
        totalPages: 1,
        pageSize: 15,
      },
      disableDraftBtn: false,
      saveConfirmDialogShow: false,
      nextPath:'',
      isContentSave: false,
      hasContentChange:false,
    }
  },
  computed: {
    currentUserId() {
      return this.$store.state.currentUserId;
    }
  },
  mounted() {
    this.checkLogin();
    window.onbeforeunload = function () {
      return '系统可能不会保存填写的信息哦';
    }
    this.listCategories();
    this.listImages();
    let articleId = this.$route.query.articleId;
    if (articleId) {
      //获取文章详情
      this.getArticleDetail(articleId);
    }
  },
  beforeDestroy() {
    window.onbeforeunload = null;
  },
  beforeRouteLeave(to, from, next) {
    if (this.isContentSave || !this.hasContentChange) {
      next();
    } else {
      this.saveConfirmDialogShow = true;
      this.nextPath = to.path;

    }
  },
  watch:{
    article:{
      handler() {
        this.hasContentChange = true
      },
      deep:true
    },
    currentUserId(newValue) {
      //console.log('currentUserId == > ' + newValue);
    }
  },
  methods:{
    async checkLogin(){
      let checkInfo = await Api.checkToken();
      console.log(checkInfo)
      if (checkInfo.code === 4002) {
        location.href = '/login?redirect='+location.href
      }
    },
    toNextPage(){
      this.saveConfirmDialogShow = true;
      this.isContentSave = true;
      this.hasContentChange = false;
      this.$router.push({
        path:this.nextPath
      })
    },
    preView(){
      this.$refs.mdEitor.toolbar_right_click('read');
    },
    saveArticleDraft(){
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空');
        return;
      }
      this.article.state = '2';
      Api.saveArticleDraft(this.article).then(result=>{
        if (result.code === Api.success_code) {
          window.onbeforeunload = null;
          this.isContentSave = true;
          this.$message.success(result.message);
          this.$router.push({
            path:'/u/'+this.currentUserId
          })

        } else {
          this.$message.error(result.message);
        }
      })
    },
    commitArticle(){

      if (this.article.title === '') {
        this.$message.error('文章标题不能为空');
        return;
      }
      if (this.article.content === '') {
        this.$message.error('文章内容不能为空');
        return;
      }
      if (this.article.categoryId === '') {
        this.$message.error('文章类别不能为空');
        return;
      }
      if (this.article.summary === '') {
        this.$message.error('文章摘要不能为空');
        return;
      }
      if (this.article.cover === '') {
        this.$message.error('文章封面不能为空');
        return;
      }
      if (this.labels.length === 0) {
        this.$message.error('文章标签不能为空');
        return;
      }
      let tmpLabels = '';
      this.labels.forEach((item, index) => {
        tmpLabels += item;
        if (index !== this.labels.length - 1) {
          tmpLabels += '-';
        }
      })
      this.article.labels = tmpLabels;
      if (this.article.state === '0' || this.article.state === '2') {
        this.article.state = '1';
      }
      if (this.article.id === '') {
        Api.postArticle(this.article).then(result => {
          if (result.code === Api.success_code) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/u/'+this.currentUserId
            })

          } else {
            this.$message.error(result.message);
          }
        })
      } else {
        Api.updateArticle(this.article, this.article.id).then(result => {
          if (result.code === Api.success_code) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/u/'+this.currentUserId
            })

          } else {
            this.$message.error(result.message);
          }
        })
      }

    },
    resetArticle(){
      this.article =  {
        title:'',
        content: '',
        categoryId:'',
        summary:'',
        cover:'',
        labels: '',
        state:'1',
        type:'1',
      }
    },
    onEditorImageClick(){
      this.imageSelectFor = 'article';
      this.isImgSelectorShow = true;
    },
    handleArticleImageSuccess(response){
      if(response.code === Api.success_code) {
        this.$message.success(response.message);
        this.listImages();
      }
    },
    onUploadImageError() {
      this.$message.error('上传图片失败')
    },
    showAddLabelBtn(){
      this.labelInputVisible = false;
    },
    deleteLabel(label){
      this.labels.splice(this.labels.indexOf(label), 1);
      if (this.labels.length < 5) {
        this.labelInputVisible = true;
        this.isEnough = false;
      }
      if (this.labels.length ===0) {
        this.labelInputVisible = false;
      }
    },
    handleLabelInputConfirm(){
      //回车
      if (this.labels.length < 5 && this.labelNewVal !== '') {
        this.labels.push(this.labelNewVal)
        this.labelNewVal = '';
      }
      if (this.labels.length >= 5) {
        this.labelInputVisible = false;
        this.isEnough = true;
        this.$message.warning('最多输入5个标签');
      }

    },
    showLabelInput() {
      //判断个数：5个
      //控制输入框的显示
      if(this.labels.length < 5) {
        this.labelInputVisible = true;
      } else {
        this.labelInputVisible = false;
      }
      this.$nextTick(()=>{
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    listCategories(){
      Api.getCategories().then(result => {
        if (result.code === Api.success_code) {
          this.categoryList = result.data;
        } else {
          this.$message.error(result.message)
        }
      })
    },

    showCoverSelector() {
      this.imageSelectFor = 'cover';
      this.isImgSelectorShow = true;
    },
    onImageSelect() {
      let item = this.images[this.selectedImagePathIndex];
      if (this.imageSelectFor === 'article') {
        //console.log(this.images[this.selectedImagePathIndex])
        this.$refs.mdEitor.toolbar_left_addlink('no-link', item.name,  '/portal/image/'+item.url);
      } else if (this.imageSelectFor === 'cover') {
        //console.log(this.selectedImagePathIndex);
        this.article.cover = item.url;
      }
      this.isImgSelectorShow = false;
    },
    listImages() {
      Api.listImages(this.pageNavigation.currentPage,this.pageNavigation.pageSize,"article").then(result=> {
        if (result.code === Api.success_code) {
          this.images = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        } else {
          this.$message.error(result.message)
        }
      })
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    getArticleDetail(articleId){
      Api.getArticleDetail(articleId).then(result => {
        if (result.code === Api.success_code) {
          let remoteArticle = result.data;
          this.article.id = remoteArticle.id;
          this.article.title = remoteArticle.title;
          this.article.content = remoteArticle.content;
          this.article.categoryId = remoteArticle.categoryId;
          this.article.summary = remoteArticle.summary;
          this.article.cover = remoteArticle.cover;
          this.article.label = remoteArticle.label;
          this.article.state = remoteArticle.state;
          this.article.type = remoteArticle.type;
          this.article.createTime = remoteArticle.createTime;
          this.labels = remoteArticle.labelList;

          //如果当前文章的状态是草稿，按钮显示发表文章
          //如果已经发布的：发布，置顶，删除，按钮显示更新
          if (this.article.state === '2') {
            this.commitText = '发表文章';
            this.disableDraftBtn = false;
          } else {
            this.commitText = '更新文章';
            //草稿这个按钮就不能用了
            this.disableDraftBtn = true;
          }
        }
      })
    },

  },
}
</script>

<style>
.label-input-box .input-new-label {
  width: 120px;
}
.post-article-box{
  width: 1140px;
  margin: 0 auto;
}
.article-title-part{
  height: 78px;
  line-height: 78px;
}
.article-title-part .el-input{
  background: #FFFFFF;
}
.article-title-part .el-input__inner {
  border: none !important;
  outline: none;
  color: #595959;
  font-size: 26px;
  font-weight: 600;
  line-height: 78px;
}
.article-title-part .el-input__inner::placeholder {
  color: #757575;
}

.article-title-part .el-input__suffix .el-input__count-inner{
  font-size: 18px;
}

.article-handle-part .v-note-op{
  position: sticky;
  top: 0;
}

.article-handle-part .markdown-body {
  height: 800px;
  box-shadow: none !important;
  z-index: auto;
}
.article-post-setting-part {
  background: #fff;
  padding: 20px;
}

.article-post-setting-part .el-textarea {
  width: 400px;
}

.action-btn-container {
  padding: 10px 10px 20px 10px;
  margin-right: 20px;
}

.article-cover {
  width: 200px;
  height: 140px;
  text-align: center;
  cursor: pointer;
  line-height: 140px;
  background: #f0f1f3;
}

.article-cover img {
  width: 200px;
  height: 140px;
}

.article-cover i{
  font-size: 20px;
  color: #999999;
}

.label-input-box .el-tag {
  margin-right: 20px;
}

.article-post-action-bar {
  background: #fff;
  width: 100%;
  margin-bottom: 20px;
}
.image-selector-list img {
  width: 108px;
  height: 100px;
  float: left;
}
.image-action-bar {
  margin-bottom: 10px;
}
.image-action-bar .upload-btn{
  float: left;
  margin-left: 8px;
}

.image-action-bar .upload-tips {
  color: #9a9a9a;
  user-select: none;
  float: left;
  margin-left: 10px;
  font-size: 16px;
  line-height: 32px
}
.image-selector-list .el-radio-button__inner ,
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner{
  border: none;
  border-radius: 4px;
  padding: 2px;
  margin: 5px;
  font-size: 0;
}

.image-picker-navigation {
  margin-top: 10px;
}
.article-post-dialog-box .el-dialog__header {
  display: none;
}
</style>
