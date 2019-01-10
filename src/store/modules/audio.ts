import * as  _ from 'lodash'
import {ActionContextBasic} from '@/store'
import {File} from './file'
import {beginAddTime, beginPlay, convertTimeStrToSecond, pausePlay, setPlayTimer} from '@/utils/utils'
import {LoopMode} from '@/utils/enum/LoopMode'
import Vue from 'vue'
import config from '@/utils/config'
import {LocalStorageKeys} from '@/utils/enum/LocalStorageKeys'
import mainApi from '@/api/mainApi'


const initState: IState = {
  serverPath: '',
  playing: false,
  currentTime: 0,
  duration: 0,
  durationStr: '',
  volume: 30,
  timer: 0,
  fps: 5,
  loopMode: LoopMode.close,
  isRandom: false,
  isMute: false,
  isLoading: false,
}

const audioState: IState = _.cloneDeep(initState)

export interface IState {
  serverPath: string,
  playing: boolean,
  currentTime: number,
  duration: number,
  volume: number,
  timer: number,
  fps: 5,
  loopMode: LoopMode,
  isRandom: boolean,
  isMute: boolean,
  isLoading: boolean,
  durationStr: string
}


export function getTimeStr(time: number) {
  const sec = Math.floor(time % 60)
  const second = sec < 10 ? '0' + sec : sec
  const minute = Math.floor(time / 60)
  return `${minute}:${second}`
}

const getters = {
  currentTimeStr(state: IState) {
    return getTimeStr(state.currentTime > state.duration ? state.duration : state.currentTime)
  },
  durationTimeStr(state: IState) {
    return getTimeStr(state.duration)
  },
  timePercent(state: IState) {
    return state.currentTime / state.duration * 100
  },
}

const actions = {
  init({dispatch}: ActionContextBasic) {
    const player = document.getElementById('player') as HTMLAudioElement
    player.loop = false
    player.addEventListener('ended', () => {
      dispatch('handleEnd')
    })
    player.volume = audioState.volume / 100
    if (navigator.mediaSession) {
      navigator.mediaSession.setActionHandler('play', () => {
        beginPlay()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        pausePlay()
      })
    }
  },

  handleEnd({commit, dispatch, rootState, state}: ActionContextBasic) {
    if (state.isRandom) {
      dispatch('randomPlay')
      return
    }

    switch (state.loopMode) {
      case LoopMode.close:
        const playingFile = rootState.home.playingFile
        const playingList = rootState.playList.playingList
        const index = playingList.findIndex((o) => o.token === playingFile.token)
        if (index === playingList.length - 1) {
          commit('setPlaying', false)
          clearInterval(state.timer)
        } else {
          dispatch('play', playingList[index + 1])
        }
        break
      case LoopMode.loopAll:
        dispatch('toNext')
        break
      case LoopMode.loopSingle:
        dispatch('play', rootState.home.playingFile)
        break
    }
  },

  play({state, commit, rootState, dispatch}: ActionContextBasic, file: File) {
    if (state.isLoading) {
      return
    }
    if (!file.p || !file.title) {
      return
    }
    commit('setLoading', true)
    dispatch('home/getLikeRecord', {file}, {root: true})
    const musicPath = file.musicUrl.endsWith(config.musicExt)
      ? file.musicUrl : file.musicUrl.split('.')[0] + `.${config.musicExt}`
    commit('initPlay', musicPath)
    setTimeout(() => {
      const player = document.getElementById('player') as HTMLAudioElement
      player.load()
      clearInterval(state.timer)
      const msg = (new Vue()).$Message.loading({
        content: '正在加载...',
        duration: 0,
      })
      player.onloadeddata = () => {
        commit('setMusicInfo', file.time)
        setPlayTimer()
        player.play()
        msg()
        commit('setLoading', false)
      }
      // 设置当前播放文件
      dispatch('home/setPlayingFile', file, {root: true})
      if (!rootState.home.isInRecentPlay) {
        dispatch('playList/addRecentPlay', file, {root: true})
      }
      mainApi.addPlayCount({artist: file.p, title: file.title})
    })
  },

  abort({commit, dispatch}: ActionContextBasic) {
    dispatch('home/setPlayingFile', new File(), {root: true})
    const player = document.getElementById('player') as HTMLAudioElement
    player.pause()
    commit('clearPlaying')
  },

  togglePlay({commit, rootState, state, dispatch}: ActionContextBasic) {
    if (state.isLoading) {
      return
    }
    if (rootState.playList.playingList.length === 0 /*|| rootState.home.playingFile.id === 0*/) {
      return
    }
    const player = document.getElementById('player') as HTMLAudioElement

    if (state.serverPath !== rootState.home.playingFile.musicUrl) {
      dispatch('play', rootState.home.playingFile)
      return
    }
    if (player.paused) {
      beginPlay()
    } else {
      pausePlay()
    }
  },

  toPrev({dispatch, rootState}: ActionContextBasic) {
    const playingFile = rootState.home.playingFile
    const playingList = rootState.playList.playingList

    if (playingList.length === 0) {
      return
    }

    if (audioState.isRandom) {
      dispatch('randomPlay')
      return
    }
    let index = playingList.findIndex((o) => o.token === playingFile.token) - 1
    if (index < 0) {
      index = playingList.length - 1
    }
    dispatch('play', playingList[index])
  },
  toNext({dispatch, rootState}: ActionContextBasic) {


    const playingFile = rootState.home.playingFile
    const playingList = rootState.playList.playingList

    if (playingList.length === 0) {
      return
    }

    if (audioState.isRandom) {
      dispatch('randomPlay')
      return
    }

    let index = playingList.findIndex((o) => o.token === playingFile.token) + 1
    if (index >= playingList.length) {
      index = 0
    }
    dispatch('play', playingList[index])
  },
  randomPlay({dispatch, rootState}: ActionContextBasic) {
    const playingList = rootState.playList.playingList
    const index = Math.floor(Math.random() * playingList.length)
    dispatch('play', playingList[index])
  },
  stop({commit}: ActionContextBasic) {
    const player = document.getElementById('player') as HTMLAudioElement
    player.pause()
    commit('setPlaying', false)
    clearInterval(audioState.timer)
  },
}

const mutations = {
  initPlay(state: IState, path: string) {
    state.serverPath = path
  },
  initVolume(state: IState, vol: number) {
    state.volume = vol
  },
  clearPlaying(state: IState) {
    clearInterval(state.timer)
    state.duration = 0
    state.currentTime = 0
    state.serverPath = ''
  },
  setMusicInfo(state: IState, time: string) {
    // const player = <HTMLAudioElement> document.getElementById('player');
    // state.duration = player.duration;
    state.duration = convertTimeStrToSecond(time)
    state.currentTime = 0
    state.playing = true
  },
  setTimer(state: IState, timer: number) {
    state.timer = timer
  },
  /**
   * 当前时间自增
   */
  syncCurrentTime(state: IState, time: number) {
    // state.currentTime += 1 / state.fps
    // state.currentTime += time
    const player = document.getElementById('player') as HTMLAudioElement
    // console.log(player.currentTime)
    state.currentTime = Math.floor(player.currentTime)
  },

  setPlaying(state: IState, b: boolean) {
    state.playing = b
  },
  handleSelectTime(state: IState, val: number) {
    state.currentTime = state.duration * val / 100
    const player = document.getElementById('player') as HTMLAudioElement
    player.currentTime = state.currentTime

    if (state.playing) {
      beginAddTime()
    }
  },
  handleInputTime(state: IState) {
    clearInterval(state.timer)
  },

  handleChangeVolume(state: IState, val: number) {
    state.isMute = false
    state.volume = val
    const player = document.getElementById('player') as HTMLAudioElement
    player.volume = state.volume / 100
    localStorage.setItem(LocalStorageKeys.volume, val.toString())
  },

  toggleRandom(state: IState) {
    state.isRandom = !state.isRandom
  },

  switchLoopMode(state: IState) {
    switch (state.loopMode) {
      case LoopMode.close:
        state.loopMode = LoopMode.loopAll
        break
      case LoopMode.loopAll:
        state.loopMode = LoopMode.loopSingle
        break
      case LoopMode.loopSingle:
        state.loopMode = LoopMode.close
        break
    }
  },

  toggleMute(state: IState) {
    const player = document.getElementById('player') as HTMLAudioElement
    state.isMute = !state.isMute
    player.muted = state.isMute
  },
  addVolume(state: IState, num: number) {
    const volume = state.volume
    if (volume + num > 100) {
      state.volume = 100
      return
    }
    if (volume + num < 0) {
      state.volume = 0
      return
    }
    state.volume += num
  },
  setLoading(state: IState, isLoading: boolean) {
    state.isLoading = isLoading
  },
}

export default {
  namespaced: true,
  state: audioState,
  getters,
  actions,
  mutations,
}
