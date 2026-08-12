import React from 'react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import { FaRegPaperPlane } from 'react-icons/fa'
import NewsletterForm from '@components/NewsletterForm'
import useMailChimp from '@helpers/useMailChimp'

const InstagramNewsletter = () => {
  const { handleSubmit, canSubmit, submitting, message, success } =
    useMailChimp()

  return (
    <Box
      as='section'
      aria-labelledby='instagram-newsletter-title'
      data-instagram-newsletter
      sx={{
        mx: [3, 4, 5],
        mt: 0,
        px: [3, 4],
        py: 3,
        borderTopWidth: 1,
        borderTopStyle: `solid`,
        borderTopColor: `omegaLight`,
        bg: `omegaLighter`
      }}
    >
      <Box
        sx={{
          display: `grid`,
          gridTemplateColumns: [`1fr`, `minmax(0, 1fr) minmax(22rem, 0.8fr)`],
          alignItems: `center`,
          gap: [3, 4]
        }}
      >
        <Flex sx={{ alignItems: `center`, gap: 3, minWidth: 0 }}>
          <Box
            aria-hidden='true'
            sx={{
              display: `grid`,
              placeItems: `center`,
              flex: `0 0 auto`,
              width: 36,
              height: 36,
              color: `alpha`,
              bg: `contentBg`,
              borderRadius: `full`,
              svg: { width: 16, height: 16 }
            }}
          >
            <FaRegPaperPlane />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Heading
              id='instagram-newsletter-title'
              as='h3'
              sx={{
                color: `heading`,
                fontSize: [2, 3],
                lineHeight: `heading`,
                m: 0
              }}
            >
              Yeni yazılardan haberdar ol
            </Heading>
            <Text
              as='p'
              sx={{
                color: `text`,
                fontSize: 1,
                lineHeight: `body`,
                mt: 1,
                mb: 0
              }}
            >
              Yeni rota ve kamp rehberlerini kısa bir e-postayla paylaşırım.
            </Text>
          </Box>
        </Flex>
        <NewsletterForm
          compact
          {...{
            handleSubmit,
            canSubmit,
            submitting,
            message,
            success
          }}
        />
      </Box>
    </Box>
  )
}

export default InstagramNewsletter
