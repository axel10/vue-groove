import Vue from 'vue'

interface openOpt {
  title:string,
  desc?:string
}
export default {
  open(opt:openOpt){
    (new Vue()).$Notice.open(opt)
  }
}