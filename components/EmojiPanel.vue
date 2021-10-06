<template>
  <div class="emoji-panel-container">
    <div class="emoji-title" v-show="history.length !== 0">
      <span>最近使用</span>
      <span class="delete-history" @click="removeHistory">删除历史</span>
    </div>
    <div class="emoji-history-container">
      <img class="emoji-item"
           v-for="i in history"
           :src="'https://cdn.sunofbeaches.com/emoji/'+i+'.png'"
           :key="i"
           @click="appendEmoji(i)"/>
    </div>
    <div class="emoji-title">
      全部表情
    </div>
    <div class="emoji-all-container">
      <img class="emoji-item" v-for="i in 130" :src="'https://cdn.sunofbeaches.com/emoji/'+i+'.png'" :key="i" @click="appendEmoji(i)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmojiPanel.vue",
  data(){
    return {
      history:[]
    }
  },
  methods:{
    removeHistory(){
      //删除历史记录
      window.localStorage.removeItem('emoji-history')
      this.history=[]
      this.reStoreHistory()
    },
    appendEmoji: function (i) {




      let targetUrl = 'https://cdn.sunofbeaches.com/emoji/' + i + '.png'

      this.$emit("emojiClick", targetUrl);
      //创建标签
      // let imgTag = document.createElement('img');
      // imgTag.src = targetUrl;
      // imgTag.width = 14;
      // imgTag.height = 14;
      // let inputBox = document.getElementById('input-box');
      // inputBox.append(imgTag)

      //let imgTag = `<img src="${targetUrl}" class="emoji">`;
      //document.execCommand('insertHTML', false, imgTag);

      //保存历史记录
      this.saveHistory(i)
      this.reStoreHistory();
    },

    reStoreHistory(){
      //回显历史记录
      let record = window.localStorage.getItem('emoji-history');
      if (record) {
        this.history = record.split(',')
      }
    },
    saveHistory(emojiIndex){
      //先获取，再拼接，再保存
      let record = window.localStorage.getItem('emoji-history');
      let saveStr = emojiIndex;
      let count = 1;
      if(record) {
        let splitArrays = record.split(',');
        for (let i = 0; i < splitArrays.length; i++) {
          let item = splitArrays[i];
          if (emojiIndex.toString() !== item) {
            saveStr += ',';
            saveStr += item
            count++;
            if (count > 6) {
              break;
            }
          }

        }
      }
      window.localStorage.setItem('emoji-history', saveStr)
    }
  },
  mounted() {
    this.reStoreHistory();
  }
}
</script>

<style>
.delete-history{
  color: #909090;
  cursor: pointer;
}
.emoji-title{
  display: flex;
  justify-content: space-between;
}

.emoji-item{
  width: 55px;
  height: 55px;
  padding: 10px;
  transition: all .3s linear;
  cursor: pointer;
}

.emoji-item:hover{
  transform: scale(1.3);
  transition: transform .3s;
}

.emoji-title{
  padding: 10px;
}
.emoji-panel-container{
  height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}


.emoji-panel-container::-webkit-scrollbar {
  width: 10px;
}

.emoji-panel-container::-webkit-scrollbar-thumb {
  background-color: #e5e6eb;
  border-radius: 2em;
}
.emoji-panel-container::-webkit-scrollbar-track {
  background-color: #f9fafb;
  border-radius: 2em;
}

</style>
