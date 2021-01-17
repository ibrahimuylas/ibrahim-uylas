import Loadable from '@loadable/component'
import SearchFallback from './Search.Fallback'

export default Loadable(() => import('./Search'), {
  fallback: SearchFallback
})
