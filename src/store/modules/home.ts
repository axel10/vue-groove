import * as  _ from 'lodash'
import {File} from "@/store/modules/file";
import {ActionContextBasic} from "@/store";
// @ts-ignore
import config from "@/utils/config";

const initState: IState = {
  playingFile:new File(),
  isDark:false,
  playingCoverUrl: '',
  isHideBottom:false,
  isFold:false,
  isInRecentPlay:false
}

export interface IState {
  playingFile: File,
  playingCoverUrl: string,
  isDark:boolean,
  isHideBottom:boolean
  isFold: boolean
  isInRecentPlay:boolean
}

export interface ISetPlayingFilePayload {
  file:File,
  imgUrl:string
}

const state = _.cloneDeep(initState)

const getters = {}

const actions = {

  init({commit,dispatch}:ActionContextBasic){
    dispatch('file/init',{},{root:true})
    const recentPlay = JSON.parse(localStorage.getItem('recentPlay')||'[]')
    const playingList = JSON.parse(localStorage.getItem('playingList')||'[]')
    const playLists= JSON.parse(localStorage.getItem('playLists')||'[]')
    const playingFile= JSON.parse(localStorage.getItem('playingFile')||'{}')

    commit('playList/setRecentPlay',recentPlay,{root:true})
    commit('playList/setPlayingList',playingList,{root:true})
    commit('playList/setPlayLists',playLists,{root:true})
    if (playingFile.id){
      commit('setPlayingFile',playingFile)
    }

  },

  setPlayingFile({commit,rootState}:ActionContextBasic,file:File){
    commit('setPlayingFile',file)
  },
}



const mutations = {
  toggleFold(state: IState) {
    state.isFold = !state.isFold
  },
  setPlayingFile(state: IState,file:File) {
    state.playingFile = file
    localStorage.setItem('playingFile',JSON.stringify(file))

  },
  setIsDark(state:IState,b:boolean){
    state.isDark = b
  },
  setIsHideBottom(state:IState,b:boolean){
    state.isHideBottom = b
  },
  isInRecentPlay(state:IState,b:boolean){
    state.isInRecentPlay = b
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
