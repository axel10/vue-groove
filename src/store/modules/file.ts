import * as  _ from 'lodash'
import {ActionContextBasic} from '@/store'
import mainApi from '../../api/mainApi'
import {convertFilesToLinearArray, initResourceInfo} from '@/utils/utils'
import {BaseItem} from '@/types/BaseItem'


const initState = {
  files: [],
  allFile: [],
  currentFiles: [],
  path: [],
  // dropDownShow: false,
  // dropDownFile: null,
}

export interface IState {
  files: File[],
  allFile: File[],
  currentFiles: File[],
  path: string[],
  isDir: boolean,
  imgUrl: '',
  musicUrl: ''
}

export class File extends BaseItem {
  public id!: string
  public title: string
  public content: File[]
  public p: string
  public cdTitle: string
  // trck: number;
  public sort: number
  public imgUrl: string
  public musicUrl: string
  public time!: string
  public token?: string
  public album!: string

  constructor() {
    super()
    this.title = ''
    this.content = []
    this.p = ''
    this.cdTitle = ''
    // this.trck=0
    this.sort = 0
    this.imgUrl = ''
    this.musicUrl = ''
  }
}

const fileState = _.cloneDeep(initState)

const getters = {
  currentFiles(state: IState) {
    const path = _.cloneDeep(state.path)
    if (path.length === 0) {
      return state.files
    } else {  // 在不是根级目录的情况下
      let files = _.cloneDeep(state.files)
      let filesTmp: File[] = []
      while (path.length > 0) {
        const pathItem = path.shift()
        const tmp = files.find((o) => {
          return o.title === pathItem
        })
        if (tmp) {
          filesTmp = tmp.content || []
          files = filesTmp
        }
      }
      filesTmp.sort((a, b) => {
        return b.sort - a.sort
      })
      return filesTmp
    }
  },
}

const actions = {

  async init({commit, dispatch}: ActionContextBasic) {
    await dispatch({type: 'getFiles'})
  },

  async getFiles({commit, dispatch}: ActionContextBasic) {
    let i = 0
    const delay = 800
    for (let j = 0; j < delay / 100; j++) {
      setTimeout(() => {
        i++
      }, 100)
    }
    const files = await mainApi.getFiles()
    files.sort((e1, e2) => {
      if (e1.sort > e2.sort) {
        return -1
      }
      if (e1.sort < e2.sort) {
        return 1
      }
      return 0
    })
    commit('setFiles', files)
    if (i < delay) {
      setTimeout(() => {
        commit('home/setData', {key: 'loaded', val: true}, {root: true})
      }, delay - i)
    } else {
      commit('home/setData', {key: 'loaded', val: true}, {root: true})
    }
  },

  randomPlayAll({dispatch, commit, state}: ActionContextBasic) {
    commit('playList/setPlayingList', state.allFile, {root: true})
    const index = Math.floor(state.allFile.length * Math.random())
    dispatch('audio/play', state.allFile[index], {root: true})
  },

  playDirs({dispatch, commit}: ActionContextBasic, dir: File[]) {

    if (!dir[0].content) {
      dispatch('audio/play', dir[0], {root: true})
      dispatch('playList/addToPlayingList', dir, {root: true})
      return
    }

    const allFile = dir.reduce((res: File[], item) => {
      return res.concat(getAllFileByContent(item.content))
    }, [])
    dispatch('audio/play', allFile[0], {root: true})
    commit('playList/setPlayingList', allFile, {root: true})
  },
}

function getAllFileByContent(content: File[]) {
  const tmp: File[] = []

  function pushItem(con: File[]) {
    /*    for (let i = 0; i < content.length; i++) {
          if (content[i].content) {
            pushItem(content[i].content)
          } else {
            tmp.push(content[i])
          }
        }*/
    for (const item of con) {
      if (item.content) {
        pushItem(item.content)
      } else {
        tmp.push(item)
      }
    }
  }

  pushItem(content)
  return tmp
}


const mutations = {
  setFiles(state: IState, files: File[]) {
    initResourceInfo(files)
    state.allFile = convertFilesToLinearArray(files)
    state.files = files
  },
  setPath(state: IState, paths: string[]) {
    state.path = paths
    // sessionStorage.setItem('path', JSON.stringify(state.path));
  },
  toPrev(state: IState) {
    if (state.path.length > 0) {
      state.path.pop()
    }
  },
  setCurrentFiles(state: IState, files: File[]) {
    state.currentFiles = files
  },
}

export default {
  namespaced: true,
  state: fileState,
  getters,
  actions,
  mutations,
}
