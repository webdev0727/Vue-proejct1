/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const settingRouter = {
  path: '/SiteSetting',
  component: Layout,
  redirect: '/SiteSetting/Banner',
  name: 'SiteSetting',
  meta: {
    title: 'SiteSetting',
    icon: 'edit',
    roles: ['admin', 'editor'] // you can set roles in root nav
  },  
  children: [
    {
      path: 'Banner',
      component: () => import('@/views/setting/banner'),
      name: 'Banner',
      meta: { 
        title: 'Banner', 
        icon: 'excel',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'HelpEdit',
      component: () => import('@/views/setting/help'),
      name: 'HelpEdit',
      meta: { 
        title: 'HelpEdit', 
        icon: 'edit',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'Help',
      component: () => import('@/views/help/index'), // Parent router-view
      name: 'Help',
      meta: { title: 'Help' ,icon: 'excel',},
      redirect: '/SiteSetting/Help/MenuManage',
      children: [
        {
          path: 'MenuManage',
          component: () => import('@/views/help/menu-manage'),
          name: 'Menu',
          meta: { title: 'MenuManage',
          icon: 'excel',
          roles: ['admin', 'editor'] }
        },
        {
          path: 'create',
          component: () => import('@/views/example/create'),
          name: 'CreateArticle',
          meta: { title: 'createArticle', icon: 'edit', roles: ['admin', 'editor'] }
        },
        {
          path: 'edit/:id(\\d+)',
          component: () => import('@/views/example/edit'),
          name: 'EditArticle',
          meta: { title: 'editArticle', noCache: true, activeMenu: '/example/list' },
          hidden: true
        },
        {
          path: 'list',
          component: () => import('@/views/example/list'),
          name: 'ArticleList',
          meta: { title: 'articleList', icon: 'list' }
        }
      ]
    },
    {
      path: 'QA',
      component: () => import('@/views/bid/won'),
      name: 'Q&A',
      meta: { 
        title: 'QA', 
        icon: 'star',
        roles: ['admin', 'editor']
      }
    },
    {
      path: 'Footer',
      component: () => import('@/views/setting/config'),
      name: 'Footer',
      meta: { 
        title: 'Footer', 
        icon: 'star-off',
        roles: ['admin', 'editor']
      }
    },
  ]
}

export default settingRouter
