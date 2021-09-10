<template>
  <div class="word-cloud">
    <client-only>
      <word-cloud
        :data="labels"
        :margin="margin"
        :rotate="rotate"
        :fontSize="fontSize"
        nameKey="name"
        valueKey="count"
        :showTooltip="false"
        :wordClick="wordClickHandler">
      </word-cloud>
    </client-only>
  </div>
</template>

<script>
import * as Api from '../api/api'
export default {
  name: "LabelCloud.vue",
  data(){
    return {
      margin:{top: 0, right: 0, bottom: 0, left: 0 },
      rotate:{from: -20, to: 30, numOfOrientation: 20 },
      fontSize:[15, 55],
      labels:[],
    }
  },
  methods:{
    listLabels(){
      Api.getLabels(20).then(result=>{
        if(result.code === Api.success_code) {
          this.labels = result.data.content;
        } else {
          this.$message.error(result.data);
        }
      })
    },
    wordClickHandler(name, value, vm) {
      console.log(name);
      location.href = "/search?keyword=" + encodeURIComponent(name);
    },
  },
  mounted(){
    this.listLabels();
  }
}
</script>

<style>

</style>
