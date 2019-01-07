import request from '../utils/request'
import {rendomNum} from '@/utils/utils'
import config from '@/utils/config'

const {apiUrl} = config
export default {
  getFiles() {
    return request.get('/data/result.json?' + rendomNum(10))
  },
  getMusic(path: string) {
    return request.get(path)
  },
  register(data) {
    return request.post(apiUrl + '/user/register', data)
  },

  login(data) {
    return request.post(apiUrl + '/user/login', data)
  },
  like(data: {
    isCancel: boolean,
    token: string,
    action: string, // like或者dislike
    type: number, // 1表示专辑，2表示曲目
  }) {
    return request.post(apiUrl + '/like/like', data)
  },
  isLogin() {
    return request.get(apiUrl + '/user/isLogin')
  },
  getLikeRecord(artist, title) {
    return request.get(apiUrl + '/like/get', {token: `${artist}/${title}`})
  },
  addPlayCount(data: { artist: string, title: string }) {
    return request.post(apiUrl + '/count/AddPlayCount', data)
  }
}
