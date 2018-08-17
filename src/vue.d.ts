import Vue from 'vue'


declare module 'vue/types/vue' {
  interface Vue {
    $Message:any
    $Notice:any
  }
}
