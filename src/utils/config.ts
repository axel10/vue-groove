export default {
  // fileServer:'http://localhost:5321/',
  // coverPath:'http://localhost:5321/cover/',
  // musicPath:'http://localhost:5321/lib/'
  coverPath: 'https://file.axel10.com:5321/cover/',
  musicPath: 'https://file.axel10.com:5321/lib/',
  musicExt: 'aac',
}
export const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:5010' : 'https://api.vcollection.org'
