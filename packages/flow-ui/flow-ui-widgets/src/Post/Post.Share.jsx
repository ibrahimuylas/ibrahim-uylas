import React from 'react'
import { IconButton, Heading, Flex } from 'theme-ui'
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton
} from 'react-share'
import attachSocialIcons from '@helpers/attachSocialIcons'

const styles = {
  wrapper: {
    alignItems: `center`
  },
  heading: {
    color: `omegaDark`,
    mr: 1,
    mb: 0
  }
}

const PostShare = ({ location, title, language = 'tr' }) => {
  const url = location && location.href

  const Facebook = ({ children, label }) => (
    <FacebookShareButton aria-label={label} url={url} quote={title}>
      {children}
    </FacebookShareButton>
  )

  const Twitter = ({ children, label }) => (
    <TwitterShareButton aria-label={label} url={url} title={title}>
      {children}
    </TwitterShareButton>
  )

  const Linkedin = ({ children, label }) => (
    <LinkedinShareButton aria-label={label} url={url} quote={title}>
      {children}
    </LinkedinShareButton>
  )

  const Email = ({ children, label }) => (
    <EmailShareButton aria-label={label} url={url} subject={title}>
      {children}
    </EmailShareButton>
  )

  const buttons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    email: Email
  }

  const buttonsWithIcons = attachSocialIcons(
    Object.keys(buttons).map(s => ({ name: s }))
  )

  return (
    <Flex sx={styles.wrapper}>
      <Heading variant='h5' sx={styles.heading}>
        {language === 'en' ? 'Share' : 'Paylaş'}
      </Heading>
      {buttonsWithIcons.map(({ name, color, Icon }) => {
        const ShareButton = buttons[name]
        return (
          ShareButton && (
            <IconButton
              as='span'
              variant='simple'
              key={`share-${name}`}
              sx={{ color }}
            >
              <ShareButton label={
                language === 'en'
                  ? (name === 'email' ? 'Share by email' : `Share on ${name}`)
                  : (name === 'email' ? 'E-postayla paylaş' : `${name} ile paylaş`)
              }>
                <Icon />
              </ShareButton>
            </IconButton>
          )
        )
      })}
    </Flex>
  )
}

export default PostShare
