export default {
  // coverPath: 'https://file.vcollection.org/cover/',
  coverPath: 'https://test.file.vcollection.org/cover/',
  // musicPath: 'http://192.168.0.102:5321/mp3convert/',
  musicPath: 'https://test.file.vcollection.org/mp3convert/',
  // musicPath: 'https://file.vcollection.org/mp3convert/',
  musicExt: 'mp3',
}
export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5010' : 'https://api.vcollection.org'
