import request from '../utils/request'
import {randomNum} from '@/utils/utils'
import {apiUrl} from '@/utils/config'


interface LikeRecord {
  liked: boolean
  disliked: boolean
  likeCount: number
}

interface Response<T> {
  success: boolean
  data: T
}

export default {
  getFiles() {
    return request.get('/data/result.json?' + randomNum(10))
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
    album: string,
  }) {
    return request.post(apiUrl + '/like/like', data)
  },
  isLogin() {
    return request.get(apiUrl + '/user/isLogin')
  },
  async getLikeRecord(artist: string, title: string, album: string): Promise<Response<LikeRecord>> {
    // return request.get(apiUrl + '/like/get', {token: `${artist}/${title}`})
    if (!album) {
      throw new Error('album未传')
    }
    return await request.get(apiUrl + '/like/getLikeRecord', {token: `${artist}/${title}`, album})
  },
  addPlayCount(data: { artist: string, title: string, album: string }) {
    return request.post(apiUrl + '/count/AddPlayCount', data)
  },
  /*  reportError(message: string) {
      return axios.post(apiUrl + '/home/reportError', {message})
    },*/
}



