const canTrack = () =>
  typeof window !== 'undefined' && typeof window.gtag === 'function'

export const trackEvent = (eventName, parameters = {}) => {
  if (!canTrack()) return

  window.gtag('event', eventName, parameters)
}

export const currentPagePath = () =>
  typeof window !== 'undefined' ? window.location.pathname : undefined
