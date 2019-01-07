import Vue from 'vue'


declare module 'vue/types/vue' {
  interface Vue {
    $Message: any
    $Notice: any
  }
}


declare global {
  interface Navigator {
    mediaSession: any
  }

  interface String {
    myExtendAction: () => void
  }

  const myVariable = 1
}
