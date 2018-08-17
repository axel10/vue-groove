import Vue from 'vue'


export default {
  info(msg:string){
    // @ts-ignore
    (new Vue()).$Message.info(msg)
  }

}