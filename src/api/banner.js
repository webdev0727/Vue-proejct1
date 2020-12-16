import request from '@/utils/request'

export function getBanner() {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        {
          banner{
            id
            title
            img                
            bg_color
            createdAt
            updatedAt            
          }
        }
      `
    }
  })
}
