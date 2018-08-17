<template>
  <transition name="dropdown">
    <div v-show="show" class="DropdownList" :style="{'left':x+'px','top':y-30+'px'}" ref="dropDown">
      <ul>
        <li class="DropdownListItem" v-for="(item,i) in items" @click="execCallback(item)"
            :class="{'split':item.split,'disabled':item.isDisable}">{{item.label}}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import * as _ from "lodash";
  import {DropDownMenuItem} from "../utils/utils";

  @Component({})
  export default class DropdownList extends Vue {

    @Prop(Array) items !: Array<DropDownMenuItem>;
    @Prop(MouseEvent) e !: MouseEvent;
    @Prop(Function) remove !: any;

    @Watch("show")
    onShowChange(val: boolean) {
      if (val) {

        const screenW = document.body.clientWidth;
        const screenH = document.body.clientHeight;

        const itemsClone = _.cloneDeep(this.items);
        itemsClone.sort(function (e1, e2) {
          if (!e1.label || !e2.label) return 0;
          if (e1.label.length > e2.label.length) {
            return -1;
          }
          if (e1.label.length === e2.label.length) {
            return 0;
          }
          return 1;
        });
        const selfWidth: number = itemsClone[0]!.label!.length * 26 + 20;

        const selfHeight = this.items.length * 30;

        const evtX = this.e.pageX;
        const evtY = this.e.pageY;

        let distX = 0;
        let distY = 0;

        if (screenW - evtX < selfWidth) {
          distX = screenW - selfWidth
        } else {
          distX = evtX;
        }

        if (screenH - evtY < selfHeight) {
          distY = screenH - selfHeight - 20;
        } else {
          distY = evtY;
        }
        this.x = distX;
        this.y = distY;

      }
    }

    x: number = 0;
    y: number = 0;
    show: boolean = false;

    execCallback(item: DropDownMenuItem) {
      if (typeof item.callback === "function" && !item.isDisable) {
        item.callback();
      }
    }

    public created() {
      document.addEventListener("click", hideList, true);
      document.addEventListener("contextmenu", hideList, true);

      const isInSelf = function (node: HTMLElement, className: string): boolean {
        if (node == document.body) return false;
        if (node.className.indexOf(className) !== -1) {
          return true;
        }
        if (node.parentNode) {
          return isInSelf(<HTMLElement>node.parentNode, className);
        } else {
          return false;
        }
      };

      const that: any = this;

      function hideList(e: MouseEvent) {
        const className = that.$refs.dropDown.className
        if (!isInSelf(<HTMLElement>e.target, className)) {
          e.stopPropagation();
        }
        document.removeEventListener("click", hideList, true);
        document.removeEventListener("contextmenu", hideList, true);
        // that.show = false;
        // setTimeout(() => {
        //   if (that.remove) that.remove();
        // }, 3000);
        if (that.remove) that.remove()
        e.preventDefault();
      }
    }


  }
</script>

<style scoped lang="scss">


  .DropdownList {
    background-color: #eee;
    border: 1px solid #999;
    position: absolute;
    color: #000;
    overflow: hidden;
    z-index: 10000000000!important;
    ul {
      transition: all .3s;
      width: 100%;
      padding: 10px 0;
      li {
        &.disabled {
          color: #ccc;
        }
        z-index: 10000000000;

        &:hover {
          background-color: #ccc;
        }
      }
    }
  }
</style>
<style lang="scss">
  .DropdownListItem {
    width: 100%;
    text-align: left;
    padding: 6px 12px;
    font-size: 16px;

    &.split {
      margin: 5px 0;
      width: 100%;
      height: 1px;
      background-color: #ccc;
      padding: 0;
    }
  }
</style>


<style lang="scss">
  .dropdown-enter-active, .dropdown-leave-active {
    transition: all .3s;
  }

  .dropdown-enter {
    /*    &>ul {
          transform: translateY(-100%)!important;
        }*/
    opacity: 0;
  }

  .dropdown-leave-to {
    opacity: 0;
  }
</style>