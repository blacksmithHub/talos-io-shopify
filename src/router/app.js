import GuardService from '@/services/guard'

const Home = () => import('../pages/Home')

/**
 * =======================================================================
 * App routes
 * =======================================================================
 *
 * Lazy loads component to initial page load improve performance.
 * Lazy load components are only loaded when a user is entering the route.
 * Access to this routes require user to be authenticated.
 *
 * =======================================================================
 */
export default {
  routes: [
    {
      path: '',
      component: Home,
      beforeEnter: (to, from, next) => GuardService.authorized(next)
    }
  ]
}
