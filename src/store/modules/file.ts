import * as  _ from 'lodash';
import {ActionContextBasic} from '@/store';
// @ts-ignore
import mainApi from '@/api/main';
import {convertFilesToLinearArray, initResourceUrl} from '@/utils/utils';
import {BaseItem} from '@/mixins/selectItem';


const initState = {
  files: [],
  allFile: [],
  currentFiles: [],
  path: [],
  // dropDownShow: false,
  // dropDownFile: null,
};

export interface IState {
  files: Array<File>,
  allFile: Array<File>,
  currentFiles: Array<File>,
  path: Array<string>,
  isDir: boolean,
  imgUrl: '',
  musicUrl: ''
}

export class File extends BaseItem {
  title: string;
  content: Array<File> ;
  p: string;
  cd_title: string;
  id: number;
  trck: number;
  sort: number;
  imgUrl: string;
  musicUrl: string;
  time!:string

  constructor(){
    super()
    this.title=''
    this.content=[]
    this.p=''
    this.cd_title=''
    this.id=0
    this.trck=0
    this.sort=0
    this.imgUrl=''
    this.musicUrl=''
  }
}

const state = _.cloneDeep(initState);

const getters = {
  currentFiles(state: IState) {
    const path = _.cloneDeep(state.path);
    if (path.length === 0) {
      return state.files;
    } else {  // 在不是根级目录的情况下
      let files = _.cloneDeep(state.files);
      let filesTmp: Array<File> = [];
      while (path.length > 0) {
        const pathItem = path.shift();
        let tmp = files.find(o => {
          return o.title === pathItem;
        });
        if (tmp) {
          filesTmp = tmp.content || [];
          files = filesTmp;
        }
      }
      return filesTmp;
    }
  },
};

const actions = {

  init({commit, dispatch}: ActionContextBasic) {
    dispatch({type: 'getFiles'});
/*    const path = sessionStorage.getItem('path') || '';
    if (path) {
      commit('setPath', JSON.parse(path));
    }*/
  },

  getFiles({commit}: ActionContextBasic) {
    mainApi.getFiles().then((o: Array<File>) => {
      o.sort(function (e1, e2) {
        if (e1.sort > e2.sort) {
          return -1;
        }
        if (e1.sort < e2.sort) {
          return 1;
        }
        return 0;
      });
      commit('setFiles', o);
    });
  },

  randomPlayAll({dispatch, commit, state}: ActionContextBasic) {
    commit('playList/setPlayingList', state.allFile, {root: true});
    const index = Math.floor(state.allFile.length * Math.random());
    dispatch('audio/play', state.allFile[index], {root: true});
  },

  playDirs({dispatch, commit}: ActionContextBasic, dir: Array<File>) {

    console.log(dir);
    if (!dir[0].content) {
      dispatch('audio/play', dir[0], {root: true});
      dispatch('playList/addToPlayingList',dir,{root:true})
      return
    }

    let allFile = dir.reduce((res:Array<File>, item) => {
      return res.concat(getAllFileByContent(item.content));
    }, []);
    dispatch('audio/play', allFile[0], {root: true});
    commit('playList/setPlayingList', allFile, {root: true});
  }
};

function getAllFileByContent(content: Array<File>) {
  let tmp:Array<File> = [];

  function pushItem(content:Array<File>) {
    for (let i = 0; i < content.length; i++) {
      if (content[i].content) {
        pushItem(content[i].content);
      } else {
        tmp.push(content[i]);
      }
    }
  }

  pushItem(content);
  return tmp;
}


const mutations = {
  setFiles(state: IState, files: Array<File>) {
    initResourceUrl(files);
    state.allFile = convertFilesToLinearArray(files);
    state.files = files;
  },
  setPath(state: IState, fileName: any) {
    if (typeof fileName === 'string') {
      state.path.push(fileName);
    }
    if (typeof fileName === 'object') {
      state.path = fileName;
    }
    sessionStorage.setItem('path', JSON.stringify(state.path))
  },
  toPrev(state: IState) {
    if (state.path.length > 0) {
      state.path.pop();
    }
  },
  setCurrentFiles(state: IState, files: Array<File>) {
    state.currentFiles = files;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
