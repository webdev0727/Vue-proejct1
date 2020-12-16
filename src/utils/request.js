import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 25000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
        
  if (response.data.errors) {
    const erorr_code=response.data.errors[0].extensions.code
    
    if(erorr_code=="UNAUTHENTICATED"){        
      Message({
        message: erorr_code,
        type: 'error',
        duration: 5000
      })
      store.dispatch('user/logout')
      router.push({ 
        name: 'login',
        query:{
          redirect: router.currentRoute.path
        } 
      })
    }
    else if(erorr_code=="NOUSER"){
      Message({
        message: "There is no User",
        type: 'error',
        duration: 5000
      })
    }
    else if(erorr_code=="FORBIDDEN"){
      Message({
        message: response.data.errors[0].message,
        type: 'error',
        duration: 5000
      })
    }
    else{
      Message({
        message: response.data.errors[0].message,
        type: 'error',
        duration: 2000
      })
    }
    return Promise.reject(response.data.errors)
    
  } 
  const data = response.data.data
  return data
},
error => {
  console.log('err' + error) // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
}
)

export default service
