import * as  _ from 'lodash'
import {ActionContextBasic} from "@/store";

const initState = {
  list:[],
  view:{
    text:''
  }
}

export interface IState {
  list:string[],
  view:{
    text:string
  }
}

const getters = {}


const actions = {
  testAction({dispatch,commit}:ActionContextBasic){
    commit('add')
    // console.log(context);
  }
}

const mutations = {
  add(state:IState){
    state.list.push(state.view.text)
  },
  setText(state:IState,str:string){
    state.view.text = str
  }
}

export default {
  namespaced: true,
  state:initState,
  getters,
  actions,
  mutations
}
