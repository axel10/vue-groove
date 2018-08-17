import * as  _ from 'lodash'

const initState: IState = {
  isShowList: true,
  isSelectMode: false,
  selectedFileIds: []
}

export interface IState {
  isShowList: boolean,
  isSelectMode: boolean,
  selectedFileIds: Array<number>
}

const state = _.cloneDeep(initState)

const getters = {}

const actions = {}

const mutations = {
  setShowList(state: IState, b: boolean) {
    state.isShowList = b
  },
  removeSelectedFile(state: IState, id: number) {
    state.selectedFileIds.splice(state.selectedFileIds.indexOf(id),1)

  },
  addSelectedFile(state: IState, id: number) {
    state.selectedFileIds.push(id)

  },
  toSelectMode(state:IState,id:number){
    state.isSelectMode = true
    state.selectedFileIds.push(id)
  },
  cancelSelect(state:IState){
    state.isSelectMode = false
    state.selectedFileIds = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
