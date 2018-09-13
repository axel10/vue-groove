<template>
  <div>
    <ul style="color: #fff" ref="ul">
      <li v-for="item in arr" :key="guid()">{{item}}</li>
    </ul>

    <div class="test"></div>

  </div>
</template>

<script lang="ts">
  import {Component, Mixins, Vue} from "vue-property-decorator";
  import {confirm, guid} from "../utils/utils";
  import {Sortable,Plugins} from "@shopify/draggable";
  import {
    State,
    Getter,
    Action,
    Mutation,
    namespace
  } from "vuex-class";
  import TestMixins from '@/mixins/test'
  const testmodule = namespace("test");


  @Component({
    mixins:[TestMixins]
  })
  export default class Test extends Vue {
    @testmodule.Action public testAction!: any;
    @testmodule.Mutation public setText!: any;

    // arr = [1, 2, 3, 4, 5, 6, 6, 7, 7, 8];

    guid = guid;


/*    public mounted() {
      const sortable = new Sortable(<HTMLElement>this.$refs.ul, {
        draggable: "li",
        swapAnimation:{
          duration:200,
          easingFunction: 'ease-in-out',
          horizontal: true
        },
        plugins:[Plugins.SwapAnimation]
      });

      sortable.on('sortable:stop', (e:any) => console.log(e));
    }*/

  }
</script>

<style scoped lang="scss">

  .test {
    width: 100px;
    height: 100px;
    background-color: #fff;
    &.right {
      animation: move 1s;
    }
  }

  ul,li{
    outline: none;
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(1000px);

    }
  }
</style>

<style lang="scss">
  .draggable-mirror {
    display: none;
  }
</style>