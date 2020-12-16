import request from '@/utils/request'

export function upload(File) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation($file: Upload){
          singleUpload(file: $file) {
            id
          }
        }          
      `,
      variables:{
        file: File // a.txt
      }
    }
  })
}
export function upload1(File) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation($file: Upload){
          singleUpload(file: $file) {
            id
          }
        }          
      `,
      variables:{
        file: File // a.txt
      }
    }
  })
}
