import Vue from 'vue'

interface openOpt {
  title:string,
  desc?:string,
  duration?:number
}
export default {
  open(opt:openOpt){
    (new Vue()).$Notice.open(opt)
  }
}