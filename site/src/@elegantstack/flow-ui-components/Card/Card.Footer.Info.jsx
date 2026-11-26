import React from 'react'
import { useLocation } from '@reach/router'
import { Text } from 'theme-ui'
import TextList from '@components/TextList'
import { FaRegClock } from 'react-icons/fa'
import rv, {
  responsiveVariantStyles
} from '@components/utils/buildResponsiveVariant'
import { copy } from '../../../i18n/copy'
import { getPageLanguage } from '../../../i18n/language'

const CardFooterInfo = ({ variant, date, timeToRead }) => {
  const { pathname } = useLocation()
  const labels = copy[getPageLanguage(pathname)]

  return (
    <TextList nowrap>
      {date && (
        <Text sx={responsiveVariantStyles(rv(variant, 'date'))}>{date}</Text>
      )}
      {timeToRead && (
        <Text sx={responsiveVariantStyles(rv(variant, 'timeToRead'))}>
          <FaRegClock css={{ verticalAlign: `middle` }} />{' '}
          {labels.minutes(timeToRead)}
        </Text>
      )}
    </TextList>
  )
}

export default CardFooterInfo
