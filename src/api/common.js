import request from '@/utils/request'
import {
  q_gql
} from "@/utils/index"

export default {
  add(mutate, data) {
    return request({
      url: '/',
      method: 'POST',
      data: {
        query: `
          mutation{
            ${mutate}(
              ${q_gql(data)}
            ){              
              error
              res{
                id
                createdAt
              }         
            }
          }
        `
      }
    })
  },
  del(mutate, ids) {
    return request({
      url: '/',
      method: 'POST',
      data: {
        query: `
          mutation{
            ${mutate}(
              ids: "${ids}"
            ){              
              error
            }
          }
        `
      }
    })
  }
  ,
  update(mutate, data) {
    return request({
      url: '/',
      method: 'POST',
      data: {				
        query: `
          mutation{
            ${mutate}( 
              ${q_gql(data)}
            ){              
              error            
            }
          }
        `
      }
    })
  }
}
