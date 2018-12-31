import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import * as qs from 'qs'

export class NetWorkError extends Error {
  public response!: AxiosResponse
}

function checkStatus(response: AxiosResponse) {
  if (response.status >= 200 && response.status < 300) {
    return response
  }

  const error = new NetWorkError(response.statusText)
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
/*  get: function (url:string, params) {
    return axios.get(url, params)
      .then(checkStatus)
      .then(data => data.data)
  },
  post: function (url, data, config) {
    return axios.post(url, qs.stringify({...data}), config)
      .then(checkStatus)
      .then(data => data.data)
  },*/
  get(url: string, data: object = {}, params: AxiosRequestConfig = {}) {
    url = Object.keys(data).length ? url + `?${qs.stringify(data)}` : url
    return axios.get(url, { ...params })
      .then(checkStatus)
      .then((o: AxiosResponse) => o.data)
  },
  post(url: string, data: object = {}, config: AxiosRequestConfig = {}) {
    return axios.post(url, qs.stringify({ ...data }), config)
      .then(checkStatus)
      .then((o: AxiosResponse) => o.data)
  },
}
