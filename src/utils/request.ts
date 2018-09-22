import axios from 'axios'
import qs from 'qs'




function parseJSON(response) {
  return response.json()
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new Error(response.statusText)
  error.response = response
  throw error
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

export default {
  get: function (url, params) {
    return axios.get(url, params)
      .then(checkStatus)
      .then(data => data.data)
  },
  post: function (url, data, config) {
    return axios.post(url, qs.stringify({...data}), config)
      .then(checkStatus)
      .then(data => data.data)
  },
  upload: function (url, data, config) {
    return axios.post(url, data, config).catch(e=>{
      throw e
    }).then(o=>o.data)
  }
}
