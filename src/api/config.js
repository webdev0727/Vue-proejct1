import request from '@/utils/request'

export function getConfig() {
  return request({
    url: '/',
    method: 'POST',
    data: {
      query: `
          {
            config {
              id
              item
              val
              updatedAt
              createdAt
            } 
          }
        `
    }
  })
}
export function addConfig(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          addConifg(
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
}
export function delBanner(ids){
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          delConfig(
            ids: "${ids}"
          ){              
            error
          }
        }
      `
    }
  })
}
