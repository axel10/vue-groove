export default {
  // fileServer:'http://localhost:5321/',
  // coverPath:'http://localhost:5321/cover/',
  // musicPath:'http://localhost:5321/lib/'
  coverPath: 'https://file.axel10.com:5321/cover/',
  musicPath: 'https://file.axel10.com:5321/lib/',
  musicExt: 'aac',
  apiUrl: process.env.NODE_ENV === 'development' ? 'https://localhost:44374' : 'https://api.vcollection.org',
}
