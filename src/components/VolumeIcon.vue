<template>
  <span :class="{'active':isMute}" @click="toggleMute">
      <Icon type="ios-volume-up" v-if="volume>70 && !isMute"/>
       <Icon type="ios-volume-down" v-if="volume>0&&volume<=70 && !isMute"/>
       <Icon type="ios-volume-off" v-if="volume===0||isMute"/>
  </span>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";
  import {namespace} from "vuex-class";

  var audioModule = namespace("audio");
  @Component({})
  export default class VolumeIcon extends Vue {
    @Prop(Boolean) clickToMute!:boolean ;

    @audioModule.State volume!: number;
    @audioModule.State isMute!: boolean;

    toggleMute() {
      if (this.clickToMute) {
        this.$store.commit("audio/toggleMute");
      }
    }
  }
</script>

<style scoped lang="scss">
  span {
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      background-color: rgba(0, 0, 0, .3);
    }
  }
</style>