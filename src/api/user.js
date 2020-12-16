import request from '@/utils/request'
import {q_gql} from "@/utils/index"

export function login(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation {
          login(
              email: "${data.username}"
              password: "${data.password}"
            ) {
              token
              user {
                id
                name
                email                
                roles{
                    id
                    name
                }
            }
          }
        }
      `
    }
  })
}
export function getUsers(data) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        {
          allUsers(              
              ${q_gql(data)}
            ) {
              total
              items {
                id
                name
                email                
                phone
                birth
                sex
                IdNumber
                aCountry
                aProvince
                aCounty
                aCity
                aAddress
                postalCode
                verified
                active
                createdAt
                updatedAt
            }
          }
        }
      `
    }
  })
}

export function getAdmin(data) {  
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        {
          allAdmins{
              total
              items {
                id
                name
                email                
                phone
                birth                
                IdNumber                
                active
                roles{
                    id
                    name
                }
                createdAt
                updatedAt
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
          updateUserActive(
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
export function remove(id) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          delUser(
            id: "${id}"
          ){              
            error
          }
        }
      `
    }
  })
}
export function removeAdmin(id) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        mutation{
          delAdmin(
            id: "${id}"
          ){              
            error
          }
        }
      `
    }
  })
}
export function getInfo(id) {
  return request({
    url: '/',
    method: 'POST',
    data: {				
      query: `
        {
          getUser(
            id: ${id}
          ){              
            id
            name
            email                
            phone
            birth
            sex
            IdNumber
            aCountry
            aProvince
            aCounty
            aCity
            aAddress
            postalCode
            verified
            active
            roles{
              id
              name
            }
            createdAt
            updatedAt
          }
        }
      `
    }
  })
}

export function existItem(key, val, id) {		
  console.log(id)	
  return request({
    url: '/',
    method: 'POST',
    data: { 
      query: `
        {
          existItem(									
              index:		"${key}"
              val:		"${val}"
              id:     "${id}"									
            ) {
              error
            }								
        }
      `
    }     
  })  
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
