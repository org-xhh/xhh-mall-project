import axios from '@/utils/axios'

export function getHomeData(data) {
  return axios({
    url: '/home',
    method: 'get',
    params: data
  })
}

export function getPostData(data) {
  return axios({
    url: '/test',
    method: 'post',
    data
  })
}
