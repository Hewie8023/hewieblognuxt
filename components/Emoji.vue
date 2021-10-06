<template>
  <div id="emoji" class="parent">
    <div class="input-box-container">

      <RichTextInput ref="richTextInput" v-model="inputContent"></RichTextInput>
      <div class="input-action-part">
        <span class="emoji-trigger" ref="emojiTrigger" @click="showEmojiBox">表情</span>
        <span class="content-post-btn" @click="doPost">发表</span>
      </div>
    </div>
    <div class="emoji-container" v-if="isShowEmoji">
      <EmojiPanel @emojiClick="onEmojiClick"></EmojiPanel>
    </div>
  </div>
</template>

<script>
import EmojiPanel from "./EmojiPanel";
import RichTextInput from "./RichTextInput";
export default {
  name: "Emoji.vue",
  components:{
    EmojiPanel,
    RichTextInput
  },
  data(){
    return {
      isShowEmoji: false,
      inputContent:''
    }
  },
  methods:{
    showEmojiBox(){
      this.isShowEmoji = !this.isShowEmoji;
    },
    doPost(){
      console.log(this.inputContent)
    },
    onEmojiClick(emojiUrl){
      //如果输入框没有焦点
      //需要自动获取
      let inputBox = this.$refs.richTextInput
      if (document.activeElement !== inputBox) {
        //获取焦点
        inputBox.requireFocus();
      }

      let imgTag = `<img src="${emojiUrl}" class="emoji">`;
      document.execCommand('insertHTML', false, imgTag);

    }

  },

  mounted() {
    let emojiTrigger = this.$refs.emojiTrigger;
    if (emojiTrigger) {
      emojiTrigger.addEventListener("mousedown", function (event) {
        return event.preventDefault()
      })
    }
  },

}
</script>

<style>



.parent{
  width:400px ;

  background: #f1f2f8;
  margin: 30px auto;

}

.input-action-part .emoji-trigger:hover{
  opacity: 0.8;
}
.input-action-part .emoji-trigger{
  color: #909090;
  border-radius: 4px;
  margin-left: 10px;
  cursor: pointer;
}

.input-action-part .content-post-btn:hover{
  opacity: 0.8;
}
.input-action-part .content-post-btn{
  background: #3377ff;
  color: #FFFFFF;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  padding: 6px 18px;
}

.input-action-part span{
  padding: 5px 20px;
  margin-top: 10px;
}
.input-action-part{
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}

</style>
