import * as  _ from 'lodash'
import {File} from '@/store/modules/file'
import {ActionContextBasic} from '@/store'
import {LocalStorageKeys} from '@/utils/enum/LocalStorageKeys'
import mainApi from '@/api/mainApi'
import {assert, getToken} from '@/utils/utils'
import Message from '@/utils/Message'

const initState: IState = {
  playingFile: new File(),
  isDark: false,
  playingCoverUrl: '',
  isHideBottom: false,
  isFold: false,
  isInRecentPlay: false,
  isFullScreen: false,
  currentTitle: '',
  isMobile: false,
  loaded: false,
  liked: false,
  disliked: false,
  isLogin: false,
  likeCount: 0,
  loading: false,
}

export interface IState {
  playingFile: File
  playingCoverUrl: string
  isDark: boolean
  isHideBottom: boolean
  isFold: boolean
  isInRecentPlay: boolean
  isFullScreen: boolean
  currentTitle: string
  isMobile: boolean
  loaded: boolean
  liked: boolean
  disliked: boolean
  isLogin: boolean
  likeCount: number
  loading: boolean
}

export interface ISetPlayingFilePayload {
  file: File
  imgUrl: string
}

const homeState = _.cloneDeep(initState)

const getters = {}

const actions = {

  async init({commit, dispatch, rootState}: ActionContextBasic) {
    await dispatch('file/init', {}, {root: true})
    const recentPlay = JSON.parse(localStorage.getItem(LocalStorageKeys.recentPlay) || '[]')
    const playingList = JSON.parse(localStorage.getItem(LocalStorageKeys.playingList) || '[]')
    const playLists = JSON.parse(localStorage.getItem(LocalStorageKeys.playLists) || '[]')
    const playingFile = JSON.parse(localStorage.getItem(LocalStorageKeys.playingFile) || '{}') as File
    const volume = parseInt(localStorage.getItem(LocalStorageKeys.volume) || '', 10)
    commit('playList/setRecentPlay', recentPlay, {root: true})
    commit('playList/setPlayingList', playingList, {root: true})
    commit('playList/setPlayLists', playLists, {root: true})
    if (playingFile.title && rootState.file.allFile.some((file) => file.id === playingFile.id)) {
      commit('setPlayingFile', playingFile)
      // dispatch('getLikeRecord', {file: playingFile})
    }
    if (!isNaN(volume)) {
      commit('audio/initVolume', volume, {root: true})
    }

    // 验证是否登录
/*    mainApi.isLogin().then((o) => {
      commit('setData', {key: 'isLogin', val: o.data})
    })*/
  },

/*   getLikeRecord({commit}: ActionContextBasic, {file}: { file: File }) {
    assert(!!file.album, 'album缺失')
    mainApi.getLikeRecord(file.p, file.title, file.album).then((o) => {
      commit('setData', {key: 'liked', val: o.data.liked})
      commit('setData', {key: 'disliked', val: o.data.disliked})
      commit('setData', {key: 'likeCount', val: o.data.likeCount})
    })
  }, */

  setPlayingFile({commit, rootState}: ActionContextBasic, file: File) {
    commit('setPlayingFile', file)
  },

  async like({commit, state}: ActionContextBasic, {action}) {
    const {playingFile, disliked, liked, likeCount, loading} = (state as IState)
    if (loading) {
      return
    }
    commit('setData', {key: 'loading', val: true})
    if (action !== 'like' && action !== 'dislike') {
      throw new Error('action必须为like或者dislike')
    }

    if (!playingFile.title) {
      throw new Error('没有正在播放的作品')
    }
    const token = getToken(playingFile.p, playingFile.title)
    if (action === 'like') {
      if (liked) {
        commit('setData', {key: 'liked', val: false})
        commit('setData', {key: 'likeCount', val: likeCount - 1})
        try {
          await mainApi.like({isCancel: true, type: 2, action, token, album: playingFile.album})
        } catch (e) {
          commit('setData', {key: 'liked', val: true})
          commit('setData', {key: 'likeCount', val: likeCount})
        } finally {
          commit('setData', {key: 'loading', val: false})
        }
      } else {
        commit('setData', {key: 'liked', val: true})
        commit('setData', {key: 'likeCount', val: likeCount + 1})
        try {
          await mainApi.like({isCancel: false, type: 2, action, token, album: playingFile.album})
        } catch (e) {
          commit('setData', {key: 'liked', val: false})
          commit('setData', {key: 'likeCount', val: likeCount})
        } finally {
          commit('setData', {key: 'loading', val: false})
        }
      }
    } else {
      if (disliked) {
        commit('setData', {key: 'disliked', val: false})
        try {
          await mainApi.like({isCancel: true, type: 2, action, token, album: playingFile.album})
        } catch (e) {
          commit('setData', {key: 'disliked', val: true})
        } finally {
          commit('setData', {key: 'loading', val: false})
        }
      } else {
        commit('setData', {key: 'disliked', val: true})
        try {
          await mainApi.like({isCancel: false, type: 2, action, token, album: playingFile.album})
        } catch (e) {
          commit('setData', {key: 'disliked', val: false})
        } finally {
          commit('setData', {key: 'loading', val: false})
        }
      }
    }
  },
}
const setData: any = (state: IState, {key, val}) => {
  state[key] = val
}

const mutations = {
  /*  toggleFold(state: IState) {
      state.isFold = !state.isFold
    },*/
  setPlayingFile(state: IState, file: File) {
    state.playingFile = file
    localStorage.setItem('playingFile', JSON.stringify(file))
  },
  setIsDark(state: IState, b: boolean) {
    state.isDark = b
  },
  setIsHideBottom(state: IState, b: boolean) {
    state.isHideBottom = b
  },
  isInRecentPlay(state: IState, b: boolean) {
    state.isInRecentPlay = b
  },
  setIsFullScreen(state: IState, b: boolean) {
    state.isFullScreen = b
  },
  setCurrentTitle(state: IState, title: string) {
    state.currentTitle = title
  },
  setIsMobile(state: IState, b: boolean) {
    state.isMobile = b
  },
  setData,
}

export default {
  namespaced: true,
  state: homeState,
  getters,
  actions,
  mutations,
}
