import * as  _ from 'lodash'
import {File} from "@/store/modules/file";
import {ActionContextBasic} from "@/store";
import {LocalStorageKeys} from '@/utils/enum/LocalStorageKeys';

const initState: IState = {
  playingFile:new File(),
  isDark:false,
  playingCoverUrl: '',
  isHideBottom:false,
  isFold:false,
  isInRecentPlay:false,
  isFullScreen:false,
  currentTitle:'',
  isMobile:false
}

export interface IState {
  playingFile: File,
  playingCoverUrl: string,
  isDark:boolean,
  isHideBottom:boolean
  isFold: boolean
  isInRecentPlay:boolean,
  isFullScreen:boolean,
  currentTitle:string,
  isMobile:boolean
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
    const recentPlay = JSON.parse(localStorage.getItem(LocalStorageKeys.recentPlay)||'[]')
    const playingList = JSON.parse(localStorage.getItem(LocalStorageKeys.playingList)||'[]')
    const playLists= JSON.parse(localStorage.getItem(LocalStorageKeys.playLists)||'[]')
    const playingFile= JSON.parse(localStorage.getItem(LocalStorageKeys.playingFile)||'{}')
    const volume = parseInt(localStorage.getItem(LocalStorageKeys.volume)||'')
    console.log(volume);
    commit('playList/setRecentPlay',recentPlay,{root:true})
    commit('playList/setPlayingList',playingList,{root:true})
    commit('playList/setPlayLists',playLists,{root:true})
    if (playingFile.id){
      commit('setPlayingFile',playingFile)
    }
    if (!isNaN(volume)) {
      commit('audio/initVolume',volume,{root:true})
    }
  },

  setPlayingFile({commit,rootState}:ActionContextBasic,file:File){
    commit('setPlayingFile',file)
  },
}



const mutations = {
/*  toggleFold(state: IState) {
    state.isFold = !state.isFold
  },*/
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
  },
  setIsFullScreen(state:IState,b:boolean){
    state.isFullScreen = b
  },
  setCurrentTitle(state:IState,title:string){
    state.currentTitle = title
  },
  setIsMobile(state:IState,b:boolean){
    state.isMobile= b
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
