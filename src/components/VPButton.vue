<template>
  <div class="vp-btn" :class="{'small':type==='small'}" @click="$emit('click')">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"

  @Component({
    name: "Button",
    props:{
      type:{
        type:String
      }
    }
  })
  export default class VPButton extends Vue {

  }
</script>

<style scoped lang="scss">
  .vp-btn {
    background-color: rgb(0, 90, 158);
    color: #fff;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    padding: .3rem 4rem;
    cursor: pointer;

    &.small{
      padding: .3rem 2.5rem;
    }
  }
</style>
