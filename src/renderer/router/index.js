import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/Main').default,
      children: [
        {
          path: '/task',
          alias: '/',
          component: require('@/components/Task/Index').default,
          props: {
            status: 'active'
          }
        },
        {
          path: '/task/:status',
          name: 'task',
          component: require('@/components/Task/Index').default,
          props: true
        },
        {
          path: '/online-player',
          name: 'online-player',
          component: require('@/components/OnlinePlayer/Index').default,
          props: true,
          meta: { keepAlive: true },
          children: [
            {
              path: 'basic',
              alias: '',
              meta: { keepAlive: true },
              components: {
                subnav: require('@/components/Subnav/OnlinePlayerSubnav').default,
                form: require('@/components/OnlinePlayer/Basic').default
              },
              props: {
                subnav: { current: 'basic' }
              }
            }
          ]
        },
        {
          path: '/preference',
          name: 'preference',
          component: require('@/components/Preference/Index').default,
          props: true,
          children: [
            {
              path: 'basic',
              alias: '',
              components: {
                subnav: require('@/components/Subnav/PreferenceSubnav').default,
                form: require('@/components/Preference/Basic').default
              },
              props: {
                subnav: { current: 'basic' }
              }
            },
            {
              path: 'advanced',
              components: {
                subnav: require('@/components/Subnav/PreferenceSubnav').default,
                form: require('@/components/Preference/Advanced').default
              },
              props: {
                subnav: { current: 'advanced' }
              }
            },
            {
              path: 'lab',
              components: {
                subnav: require('@/components/Subnav/PreferenceSubnav').default,
                form: require('@/components/Preference/Lab').default
              },
              props: {
                subnav: { current: 'lab' }
              }
            }
          ]
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
