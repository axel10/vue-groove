import Vue from 'vue';
import Component from 'vue-class-component';

declare module 'vue/types/vue' {

  interface Vue {
    test():void,
    arr:any
  }
}

@Component
export default class testMixin<T> extends Vue {
  msg='aaa'
  arr=[]
}