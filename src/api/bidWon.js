import request from '@/utils/request'
import {q_gql} from "@/utils/index"

export function getWonList(data) {    
    return request({
      url: '/',
      method: 'POST',
      data: {				
        query: `
          {
            WonList(${q_gql(data)}){
              total
              items {                
                AuctionID
                Title
                WonPrice
                exitTime              
                userId
                ImageUrl
                ContactUrl
                AuctionItemUrl
                Bids
                failed
              }
            }
          }
        `
      }
    })
}
export function apiWonList(data) {    
    return request({
      url: '/',
      method: 'POST',
      data: {				
        query: `
          {
            apiWonList{
                error
                msg
            }
          }
        `
      }
    })
}
export function remove(data) {    
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          delWonList(                
              AuctionIDs: "${data}" 
          ){
              error
          }
        }
      `
    }
  })
}
export function checkProcess(data) {    
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          checkProcess(                
              ${q_gql(data)} 
          ){
              error
          }
        }
      `
    }
  })
}
