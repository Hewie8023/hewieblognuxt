<template>
  <div class="rich-input-container">
    <div id="input-box" class="input-box" :placeholder="hitContent" contenteditable="true" spellcheck="false">

    </div>

  </div>
</template>

<script>
export default {
  name: "RichTextInput.vue",
  model:{
    prop:'content',
    event:'onContentChange'
  },
  props:{
    content:String
  },
  data(){
    return {
      hitContent:'来聊个一毛钱的呗...',
    }
  },
  watch:{
    content(newValue) {
      this.updateContent(newValue)
    }
  },
  methods:{
    updateContent(value){
      let inputBox = document.getElementById('input-box');
      if (value !== inputBox.innerHTML) {
        inputBox.innerHTML = value;
      }
    },
    requireFocus(){
      let inputBox = document.getElementById('input-box');
      if(inputBox) {
        inputBox.focus();
      }
    }
  },
  mounted() {
    this.updateContent(this.content)
    let inputBox = document.getElementById('input-box');
    if (inputBox) {
      let that = this
      inputBox.addEventListener('input', function () {
        that.$emit('onContentChange', inputBox.innerHTML)
      })
    }
  }
}
</script>

<style>

.input-box:focus{
  border: #3377ff solid 1px;
}

.input-box .emoji{
  width: 14px;
  height: 14px;
}

.input-box img{
  margin: 2px;
  vertical-align: middle;
}
.input-box{
  display: block;
  min-width: 200px;
  min-height: 100px;
  outline: none;
  border: #ebedf0 solid 1px;
  padding: 10px;
  border-radius: 4px;
  color: #333;
  background-color: rgba(226,230,235,.2);
  min-height: 120px;
  font-size: 14px;
  line-height: 20px;
}

.input-box:empty:before {
  content: attr(placeholder);
  position: absolute;
  color: grey;
  background-color: transparent;
}

.rich-input-container{
}
</style>
