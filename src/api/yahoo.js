import request from '@/utils/request'

export function getYahooAccount() {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        {
          yahooAccount{              
            id
            name
            password                
            cookie            
            active
            status
            createdAt
            updatedAt            
          }
        }
      `
    }
  })
}

export function updateYahooAccount(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          upsertYahooAccount(
            id: "${data.id}"
            name: "${data.name}"
            password: "${data.password}"
            status: ${data.active}
            cookie: "${data.cookie}"
          ){              
            error            
          }
        }
      `
    }
  })
}
export function insertYahooAccount(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          upsertYahooAccount(
            id: "${data.id}"
            name: "${data.name}"
            password: "${data.password}"
            status: ${data.active}
            cookie: "${data.cookie}"
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
export function updateStatus(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          updateAuctionStatus(
            id: "${data.id}"            
            status: ${data.active}            
          ){              
            error
          }
        }
      `
    }
  })
}

export function deleteYahooAccount(id) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          delAuctionAccount(
            id: "${id}"
          ){              
            error
          }
        }
      `
    }
  })
}
