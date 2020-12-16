import request from '@/utils/request'
import {q_gql} from "@/utils/index"
export function getBids(data) {
    const query=q_gql(data)
    return request({
      url: '/',
      method: 'POST',
      data: {				
        query: `
          {
            bidhistory(                
                ${query} 
              ) {
                total
                items {
                    id
                    userId
                    AuctionID
                    Title
                    price
                    img
                    exitTime
                    createdAt
              }
            }
          }
        `
      }
    })
}
export function remove(ids) {    
    return request({
      url: '/',
      method: 'POST',
      data: {				
        query: `
          mutation{
            delHistory(                
                ids: "${ids}"
            ){
                error
            }
          }
        `
      }
    })
}
