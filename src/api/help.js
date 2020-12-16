import request from '@/utils/request'

export function getHelpTree() {
  return request({
    url: '/',
    method: 'POST',
    data: {
      query: `
          {
            helpTree {
              id
              name
              pid
              orders              
            } 
          }
        `
    }
  })
}
