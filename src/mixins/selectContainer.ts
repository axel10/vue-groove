import Vue from 'vue'
import {Watch} from 'vue-property-decorator';

declare module 'vue/types/vue' {
  interface Vue {
    // test():void
    selectedItems:Array<any>
    isSelectMode:boolean
  }
}


export default class SelectContainer extends Vue {

  @Watch("selectedItems")
  onSelectedFilesChanged(val:any) {
    const operations:Array<HTMLElement> = Array.prototype.slice.call(document.querySelectorAll('.operation'))

    if (val.length > 0) {
      this.$store.commit("home/setIsHideBottom", true);
      operations.forEach(o=>o.style.display='none')

    } else {
      this.$store.commit("home/setIsHideBottom", false);
      operations.forEach(o=>o.style.display='block')
    }
  }

  cancelSelect(){
    this.selectedItems = []
  }

  selectedItems:Array<any> = [];
  get isSelectMode() {
    return this.selectedItems.length > 0;
  }
}