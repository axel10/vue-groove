import request from '../utils/request'


export default {
  getFiles(){
    return request.get('/data/result.json')
  },
  getMusic(path){
    return request.get(path)
  }
}