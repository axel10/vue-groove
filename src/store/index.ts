
import Vue from 'vue'
import Vuex, { Commit, Dispatch } from 'vuex'
import test from './modules/test'
import playing from './modules/playing'
import home from '@/store/modules/home';
import audio from '@/store/modules/audio'
import file from '@/store/modules/file'
import playList from '@/store/modules/playList'
import {IState as IAudioState} from './modules/audio'
import {IState as IFileState} from './modules/file'
import {IState as IHomeState} from './modules/home'
import {IState as IPlayingState} from './modules/playing'
import {IState as IPlayListState} from './modules/playList'



Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    test,playing,home,audio,file,playList
  },
  strict:true
})


export interface ActionContextBasic {
  commit: Commit,
  dispatch: Dispatch,
  rootState:RootState,
  state:any
}

export interface RootState {
  audio:IAudioState,
  file:IFileState,
  home:IHomeState,
  playing:IPlayingState,
  playList:IPlayListState
}