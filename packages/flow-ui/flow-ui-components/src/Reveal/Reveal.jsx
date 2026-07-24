import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './Reveal.styles.css'

const Reveal = ({
  effect,
  children,
  collapse,
  fraction,
  duration,
  delay,
  className,
  style
}) => {
  const elementRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: fraction }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [fraction])

  const animationClass = visible && !collapse ? effect : ''

  return (
    <div
      ref={elementRef}
      className={['react-reveal', animationClass, className]
        .filter(Boolean)
        .join(' ')}
      style={{
        animationDuration: `${duration}ms`,
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
        ...style
      }}
    >
      {children}
    </div>
  )
}

export default Reveal

Reveal.defaultProps = {
  effect: 'fadeInUp',
  collapse: false,
  fraction: 0,
  duration: 750,
  delay: 0,
  className: undefined,
  style: undefined
}

Reveal.propTypes = {
  effect: PropTypes.oneOf([
    'fadeIn',
    'fadeInUp',
    'fadeInDown',
    'fadeInRight',
    'fadeInLeft'
  ]),
  children: PropTypes.node.isRequired,
  collapse: PropTypes.bool,
  fraction: PropTypes.number,
  duration: PropTypes.number,
  delay: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
}
