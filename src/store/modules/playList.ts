import * as  _ from 'lodash';
import {File} from '@/store/modules/file';
import {ActionContextBasic} from '@/store';
import {guid, union, unionFiles} from '@/utils/utils';

import Message from '@/utils/Message';
import Notice from '@/utils/Notice';

export interface IState {
  recentPlay: Array<File>,
  playingList: Array<File>,
  playLists: Array<PlayList>
}

export class PlayList {
  id: string;
  title: string;
  content: Array<number>;

  constructor() {
    this.id = '';
    this.title = '';
    this.content = [];
  }
}

export interface AddPlayListPayload {
  playListTitle: string,
  id: number
}

export interface CreatePlayListPayload {
  name: string,
  fileIds: Array<number>
}

const initState = {
  recentPlay: [],
  playingList: [],
  playLists: [],
};

const state = _.cloneDeep(initState);


const getters = {};

const actions = {
  addRecentPlay({commit}: ActionContextBasic, file: File) {
    commit('addRecentPlay', file);
  },
  createPlayList({commit, state}: ActionContextBasic, {name, fileIds}: CreatePlayListPayload) {
    var playLists = state.playLists;
    if (!name) name = '新建播放列表';
    const repeat = playLists.find((o: PlayList) => o.title === name);
    let distName = name;
    let count = 1;
    if (repeat) {
      while (true) {
        distName = repeat.title + `(${count + 1})`;
        if (!playLists.find((o: PlayList) => o.title === distName)) {
          break;
        }
        count += 1;
      }
    }

    if (fileIds.length > 0) {
      Notice.open({title: `已向播放列表添加了${fileIds.length}首歌曲`});
    }

    commit('createPlayList', {name: distName, fileIds});
  },

  /**
   * 添加文件到播放列表。传入播放列表的id和要添加的文件id数组
   * @param commit
   * @param payload
   */
  addToPlayList({commit}: ActionContextBasic, payload: any) {
    let {listId, ids} = payload;
    const playList: PlayList = state.playLists.find((o: PlayList) => o.id === listId) || new PlayList();
    const playListContent = playList.content;
    const content = union(playListContent, ids);
    Notice.open({title: `已向播放列表添加了${ids.length}首歌曲`});

    commit('setPlayListContent', {listId, content});
  },

  /**
   * 添加文件到正在播放列表。
   * @param commit
   * @param dispatch
   * @param rootState
   * @param state
   * @param files
   */
  addToPlayingList({commit, dispatch, rootState, state}: ActionContextBasic, files: Array<File>) {
    if (rootState.playList.playingList.length == 0) {
      /*      dispatch('audio/play',files[0],{root:true})
            dispatch('audio/togglePlay',{},{root:true})*/
      commit('home/setPlayingFile', files[0],{root:true});
    }
    commit('setPlayingList', unionFiles(state.playingList, files));
  },
  renamePlayList({commit, state}: ActionContextBasic, {name, id}: any) {
    commit('renamePlayList', {name, id});
  },

  removePlayList({commit, state}: ActionContextBasic, {context, id}: any) {

    const currentId = context.$route.params.id;
    if (currentId == id) {
      const playLists: Array<PlayList> = state.playLists;
      let prePlayListIndex = playLists.findIndex(o => o.id === id) - 1;
      if (playLists.length < 0) prePlayListIndex = 0;
      if (prePlayListIndex >= 0) {
        context.$router.replace('/playList/' + playLists[prePlayListIndex].id);
      } else {
        context.$router.replace('/allPlayList');
      }
    }

    commit('removePlayList', id);
  },

  removePlayLists({commit, state}: ActionContextBasic, ids: Array<string>) {
    const playLists = state.playLists.filter((o: PlayList) => ids.indexOf(o.id) === -1);
    commit('setPlayLists', playLists);
  },

  removePlayListContents({commit, state}: ActionContextBasic, {listId, ids}: any) {
    commit('removePlayListContents', {listId, ids});
  },

  playPlayList({dispatch, commit, state, rootState}: ActionContextBasic, id: string) {
    const currentPlayList = state.playLists.find((o: PlayList) => o.id === id);
    if (!currentPlayList || Object.keys(currentPlayList).length === 0) {
      return;
    }
    const currentPlayListIds = currentPlayList.content;
    const content = currentPlayListIds.map((o: number) => {
      return rootState.file.allFile.find(file => file.id === o);
    }).filter((o: File) => o);

    commit('setPlayingList', content);
    dispatch('audio/play', content[0], {root: true});
  },

  removePlayingList({commit, rootState, state, dispatch}: ActionContextBasic, ids: Array<number>) {
    const playingFile = rootState.home.playingFile;
    const playingList: Array<File> = state.playingList;

    if (ids.indexOf(playingFile.id) !== -1) {
      ids.sort(function (e1, e2) {
        if (e1 > e2) return 1;
        if (e1 === e2) return 0;
        return -1;
      });
      const newIndex  =playingList.findIndex(o => o.id === ids[0])
      commit('removePlayingList',ids)
      if (state.playingList.length === 0) return
      const newFile = state.playingList[newIndex];
      commit('home/setPlayingFile', newFile, {root: true});
      dispatch('audio/stop',{},{root:true})
    }else {
      commit('removePlayingList',ids)
    }



  }


};

const mutations = {
  addRecentPlay(state: IState, file: File) {
    var recentPlay = state.recentPlay;

    var index = recentPlay.findIndex(o => o.title === file.title);

    if (index === -1) {
      recentPlay.unshift(file);
    } else {
      recentPlay.splice(0, 0, recentPlay.splice(index, 1)[0]);
    }
    localStorage.setItem('recentPlay', JSON.stringify(recentPlay));
  },

  setPlayListContent(state: IState, {listId, content}: any) {
    const playList = state.playLists.find(o => o.id === listId) || new PlayList();
    playList.content = content;
    localStorage.setItem('playLists', JSON.stringify(state.playLists));
  },

  setRecentPlay(state: IState, files: Array<File>) {
    state.recentPlay = files;
    localStorage.setItem('recentPlay', JSON.stringify(state.recentPlay));

  },

  addPlayingList(state: IState, file: File) {
    state.playingList.push(file);
    localStorage.setItem('playingList', JSON.stringify(state.playingList));
  },
  setPlayingList(state: IState, files: Array<File>) {
    state.playingList = files;
    localStorage.setItem('playingList', JSON.stringify(state.playingList));
  },

  createPlayList(state: IState, {name, fileIds}: CreatePlayListPayload) {
    state.playLists.push({title: name, content: fileIds, id: guid()});
    localStorage.setItem('playLists', JSON.stringify(state.playLists));
  },


  setPlayLists(state: IState, playLists: Array<PlayList>) {
    state.playLists = playLists;
    localStorage.setItem('playLists', JSON.stringify(state.playLists));

  },

  /**
   * 重命名播放列表
   * @param state
   * @param name
   * @param id
   */
  renamePlayList(state: IState, {name, id}: any) {
    const list = state.playLists.find(o => o.id === id) || new PlayList();
    list.title = name;
  },

  removePlayList(state: IState, id: string) {
    state.playLists = state.playLists.filter(o => o.id !== id);
    localStorage.setItem('playLists', JSON.stringify(state.playLists));
  },

  removePlayListContents(state: IState, {listId, ids}: any) {
    let playList = state.playLists.find(o => o.id === listId) || new PlayList();
    playList.content = playList.content.filter(o => ids.indexOf(o) === -1);
    localStorage.setItem('playLists', JSON.stringify(state.playLists));
  },

  sortPlayListContent(state: IState, {listId, oldIndex, newIndex}: any) {
    const playList = state.playLists.find(o => o.id === listId) || new PlayList();
    const tmp = playList.content.splice(oldIndex, 1)[0];
    playList.content.splice(newIndex, 0, tmp);
    localStorage.setItem('playLists', JSON.stringify(state.playLists));
  },
  sortPlayingListContent(state: IState, {oldIndex, newIndex}: any) {
    let playingList = state.playingList;
    const tmp = playingList.splice(oldIndex, 1)[0];
    playingList.splice(newIndex, 0, tmp);
    localStorage.setItem('playingList', JSON.stringify(state.playingList));
  },
  removePlayingList(state: IState, ids: Array<number>) {
    state.playingList = state.playingList.filter(o => ids.indexOf(o.id) === -1);
    localStorage.setItem('playingList', JSON.stringify(state.playingList));
  },
  removeRecentPlay(state: IState, ids: Array<number>) {
    state.recentPlay = state.recentPlay.filter(o => ids.indexOf(o.id) === -1);
    localStorage.setItem('recentPlay', JSON.stringify(state.recentPlay));
  }

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
