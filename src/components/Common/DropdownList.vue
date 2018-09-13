<template>
  <transition name="dropdown">
    <ul v-show="show" class="DropdownList" :style="{'left':x+'px','top':y-30+'px'}" ref="dropDown">
      <li class="DropdownListItem" v-for="(item,i) in items" @click="execCallback(item)"
          @mouseenter="dealMouseEnter($event,item)"
          :class="{'split':item.split,'disabled':item.isDisable}"
          :ref="'item'"
      >
        {{item.label}}
      </li>
    </ul>
  </transition>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from "vue-property-decorator";
  import * as _ from "lodash";
  import {DropDownMenuItem} from "../../utils/utils";

  @Component({})
  export default class DropdownList extends Vue {

    @Prop(Array) items !: Array<DropDownMenuItem>;
    @Prop(MouseEvent) e !: MouseEvent;
    @Prop(Function) remove !: any;

    @Watch("show")
    onShowChange(val: boolean) {
      if (val) {
        this.items.forEach((o, i) => {
          if (o.el) {
            const div: HTMLElement = document.createElement("div");
            const items:any = this.$refs.item
            const li = <HTMLElement>items[i];
            li.appendChild(div)
            // o.el.$mount(this.$refs.item[i]);
            o.el.$mount(div);
          }
        });

        setTimeout(() => {
          const screenW = document.body.clientWidth;
          const screenH = document.body.clientHeight;
          /*          const itemsClone = _.clone(this.items);

                    itemsClone.sort(function (e1, e2) {
                      if (!e1.label || !e2.label) return 0;
                      if (e1.label.length > e2.label.length) {
                        return -1;
                      }
                      if (e1.label.length === e2.label.length) {
                        return 0;
                      }
                      return 1;
                    });*/

          const selfWidth: number = this.$el.offsetWidth + 10;

          const selfHeight = this.$el.offsetHeight;

          const evtX = this.e.pageX;
          const evtY = this.e.pageY;

          let distX = 0;
          let distY = 0;

          if (screenW - evtX < selfWidth) {
            distX = screenW - selfWidth;
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

        });

      }
    }

    dealMouseEnter(e: MouseEvent, item: DropDownMenuItem) {
      const that = this;
      var selfDom = <HTMLElement>e.target;

      var getOffset = class {
        static top(obj: HTMLElement):number {
          return obj.offsetTop + (obj.offsetParent ? this.top(<HTMLElement>obj.offsetParent) : 0);
        }

        static left(obj: HTMLElement):number {
          return obj.offsetLeft + (obj.offsetParent ? this.left(<HTMLElement>obj.offsetParent) : 0);
        }
      };


      if (item.children && item.children.length > 0 && (<HTMLElement>e.target).getElementsByTagName("ul").length === 0) {

        selfDom.onmouseout = function (e: MouseEvent) {
          var ul = <HTMLElement>selfDom.getElementsByTagName("ul")[0];
          const targetEle = (<HTMLElement>e.relatedTarget).parentElement;
          if (targetEle === selfDom || targetEle === ul) {
            return;
          }
          selfDom.removeChild(ul);
        };

        const ul: HTMLElement = document.createElement("ul");
        ul.className = "DropdownList";
        item.children.forEach(o => {
          const li: HTMLElement = document.createElement("li");
          li.className = "DropdownListItem";
          li.innerHTML = o.label||'';
          li.onmouseenter = function (e) {
            that.dealMouseEnter(e, o);
          };
          li.onclick = function () {
            that.execCallback(o);
          };
          /*          li.onmouseout = function () {
                      var ul = <HTMLElement>li.getElementsByTagName("ul")[0];
                      console.log(li);
                      if (ul) ul.style.display = "none";
                    };*/

          ul.appendChild(li);
        });
        let x = (<HTMLElement>e.target).offsetWidth;
        let y = (<HTMLElement>e.target).offsetTop;
        // ul.style.left = x + "px";
        ul.style.top = 0 + "px";

        selfDom.appendChild(ul);

        if (getOffset.left(selfDom) + selfDom.offsetWidth + ul.offsetWidth > document.body.clientWidth) {
          x = -ul.offsetWidth;
        }
        if (getOffset.top(ul) + ul.offsetHeight > document.body.clientHeight) {
          y = -(ul.offsetHeight - (document.body.clientHeight - getOffset.top(ul)));
        }

        ul.style.left = x + "px";
        ul.style.top = y + "px";
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
        const className = that.$refs.dropDown.className;
        if (!isInSelf(<HTMLElement>e.target, className)) {
          e.stopPropagation();
        }
        document.removeEventListener("click", hideList, true);
        document.removeEventListener("contextmenu", hideList, true);
        // that.show = false;
        // setTimeout(() => {
        //   if (that.remove) that.remove();
        // }, 3000);
        if (that.remove) that.remove();
        e.preventDefault();
      }
    }


  }
</script>

<style lang="scss">


  .DropdownList {
    background-color: #eee;
    border: 1px solid #999;
    position: absolute;
    color: #000;
    /*overflow: hidden;*/
    z-index: 10000000000 !important;
    transition: opacity .3s;
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

  .DropdownListItem {
    width: 100%;
    text-align: left;
    padding: 6px 12px;
    font-size: 16px;
    position: relative;
    white-space: nowrap;

    &.split {
      margin: 5px 0;
      width: 100%;
      height: 1px;
      background-color: #ccc;
      padding: 0;
    }
  }

  .dropdown-enter-active, .dropdown-leave-active {
    transition: opacity .3s;
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
