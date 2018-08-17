import * as  _ from 'lodash';
import {ActionContextBasic} from '@/store';
import {File} from './file';

export enum loopMode {
  close = 0, loopAll = 1, loopSingle = 2
}

const initState: IState = {
  serverPath: '',
  playing: false,
  currentTime: 0,
  duration: 0,
  volume: 30,
  timer: 0,
  fps: 5,
  loopMode: loopMode.close,
  isRandom: false,
  isMute: false
};

const state: IState = _.cloneDeep(initState);

export interface IState {
  serverPath: string,
  playing: boolean,
  currentTime: number,
  duration: number,
  volume: number,
  timer: number,
  fps: 5,
  loopMode: loopMode,
  isRandom: boolean,
  isMute: boolean
}


export function getTimeStr(time: number) {
  let sec = Math.floor(time % 60);
  let second = sec < 10 ? '0' + sec : sec;
  let minute = Math.floor(time / 60);
  return `${minute}:${second}`;
}

const getters = {
  currentTimeStr(state: IState) {
    return getTimeStr(state.currentTime > state.duration ? state.duration : state.currentTime);
  },
  durationTimeStr(state: IState) {
    return getTimeStr(state.duration);

  },
  timePercent(state: IState) {
    return state.currentTime / state.duration * 100;
  }
};

const actions = {
  init({dispatch}: ActionContextBasic) {
    const player = <HTMLAudioElement> document.getElementById('player');
    player.loop = false;
    player.addEventListener('ended', function () {
      // commit('setPlaying', false);
      // clearInterval(state.timer);
      dispatch('handleEnd');
    });
    player.volume = state.volume / 100;
  },

  handleEnd({commit, dispatch, rootState, state}: ActionContextBasic) {
    if (state.isRandom) {
      dispatch('randomPlay');
      return;
    }

    switch (state.loopMode) {
      case loopMode.close:
        const playingFile = rootState.home.playingFile;
        const playingList = rootState.playList.playingList;
        const index = playingList.findIndex(o => o.id == playingFile.id);
        if (index === playingList.length - 1) {
          commit('setPlaying', false);
          clearInterval(state.timer);
        } else {
          dispatch('play', playingList[index + 1]);
        }
        break;
      case loopMode.loopAll:
        dispatch('toNext');
        break;
      case loopMode.loopSingle:
        dispatch('play', rootState.home.playingFile);
        break;
    }
  },

  play({state, commit, rootState, dispatch}: ActionContextBasic, file: File) {
    const musicPath = file.musicUrl;
    commit('initPlay', musicPath);
    const player = <HTMLAudioElement> document.getElementById('player');
    player.load();
    clearInterval(state.timer);
    player.onloadeddata = function () {
      commit('setMusicInfo');
      let timer = setInterval(() => {
        commit('addCurrentTime');
      }, 1000 / state.fps);
      commit('setTimer', timer);
      player.play();
    };

    // 设置当前播放文件
    dispatch('home/setPlayingFile', file, {root: true});
    if (!rootState.home.isInRecentPlay) {
      dispatch('playList/addRecentPlay', file, {root: true});
    }
  },

  abort({commit, dispatch}: ActionContextBasic) {
    dispatch('home/setPlayingFile', new File(), {root: true});
    const player = <HTMLAudioElement> document.getElementById('player');
    player.pause();
    commit('clearPlaying');
  },

  togglePlay({commit, rootState, state, dispatch}: ActionContextBasic) {
    if (rootState.playList.playingList.length == 0 || rootState.home.playingFile.id == 0) {
      return;
    }
    const player = <HTMLAudioElement> document.getElementById('player');

    if (state.serverPath !== rootState.home.playingFile.musicUrl) {
      dispatch('play', rootState.home.playingFile);
      return
    }

    if (player.paused) {
      player.play();
      const timer = setInterval(() => {
        commit('addCurrentTime');
      }, 1000 / state.fps);
      commit('setTimer', timer);
      commit('setPlaying', true);
    } else {
      player.pause();
      commit('setPlaying', false);
      clearInterval(state.timer);
    }
  },

  toPrev({dispatch, rootState}: ActionContextBasic) {
    const playingFile = rootState.home.playingFile;
    const playingList = rootState.playList.playingList;

    if (playingList.length === 0) return;

    if (state.isRandom) {
      dispatch('randomPlay');
      return;
    }
    let index = playingList.findIndex(o => o.id === playingFile.id) - 1;
    if (index < 0) index = playingList.length - 1;
    dispatch('play', playingList[index]);
  },
  toNext({dispatch, rootState}: ActionContextBasic) {


    const playingFile = rootState.home.playingFile;
    const playingList = rootState.playList.playingList;

    if (playingList.length === 0) return;

    if (state.isRandom) {
      dispatch('randomPlay');
      return;
    }

    let index = playingList.findIndex(o => o.id === playingFile.id) + 1;
    if (index >= playingList.length) index = 0;
    dispatch('play', playingList[index]);
  },
  randomPlay({dispatch, rootState}: ActionContextBasic) {
    const playingList = rootState.playList.playingList;
    const index = Math.floor(Math.random() * playingList.length);
    dispatch('play', playingList[index]);
  },
  stop({commit}:ActionContextBasic){
    const player = <HTMLAudioElement> document.getElementById('player');
    player.pause()
    commit('setPlaying', false);
    clearInterval(state.timer);
  }
};

const mutations = {
  initPlay(state: IState, path: string) {
    state.serverPath = path;
  },
  clearPlaying(state: IState) {
    clearInterval(state.timer);
    state.duration = 0;
    state.currentTime = 0;
    state.serverPath = '';
  },
  setMusicInfo() {
    const player = <HTMLAudioElement> document.getElementById('player');
    state.duration = player.duration;
    state.currentTime = 0;
    state.playing = true;
  },
  setTimer(state: IState, timer: number) {
    state.timer = timer;
  },

  /**
   * 当前时间自增
   * @param state
   */
  addCurrentTime(state: IState) {
    state.currentTime += 1 / state.fps;
  },

  setPlaying(state: IState, b: boolean) {
    state.playing = b;
  },
  handleSelectTime(state: IState, val: number) {
    state.currentTime = state.duration * val / 100;
    const player = <HTMLAudioElement> document.getElementById('player');
    player.currentTime = state.currentTime;
  },

  handleChangeVolume(state: IState, val: number) {
    state.isMute = false;
    state.volume = val;
    const player = <HTMLAudioElement> document.getElementById('player');
    player.volume = state.volume / 100;
  },

  toggleRandom(state: IState) {
    state.isRandom = !state.isRandom;
  },

  switchLoopMode(state: IState) {
    switch (state.loopMode) {
      case loopMode.close:
        state.loopMode = loopMode.loopAll;
        break;
      case loopMode.loopAll:
        state.loopMode = loopMode.loopSingle;
        break;
      case loopMode.loopSingle:
        state.loopMode = loopMode.close;
        break;
    }
  },

  toggleMute(state: IState) {
    const player = <HTMLAudioElement> document.getElementById('player');
    state.isMute = !state.isMute;
    player.muted = state.isMute;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
