import loadable from '@loadable/component'
import SearchFallback from './Search.Fallback'

export default loadable(() => import(/* webpackPrefetch: true */ './Search'), {
  fallback: SearchFallback
})
