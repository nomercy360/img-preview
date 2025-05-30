import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

function convertUnicode(input) {
  return String.fromCodePoint(parseInt(input, 16))
}

export default async function httpPost(req: NextRequest) {
  const font = fetch(new URL('../../assets/icons.TTF', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  )

  const textFont = fetch(new URL('../../assets/Roboto-Bold.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  )

  const textFontRegular = fetch(new URL('../../assets/Roboto-Regular.ttf', import.meta.url)).then(
    (res) => res.arrayBuffer(),
  )

  if (req.method !== 'POST') {
    return new Response('Invalid method', { status: 405 })
  }

  const body = await req.json()
  const { title, subtitle, avatar, tags } = body

  if (!title || !subtitle || !avatar || !tags) {
    return new Response('Missing parameters', { status: 400 })
  }

  const fontData = await font
  const textFontData = await textFont
  const textFontDataRegular = await textFontRegular

  const rows = []
  for (let i = 0; i < tags.length; i++) {
    rows.push(<div key={i} style={{
      paddingLeft: '15px',
      paddingRight: '15px',
      paddingTop: '10px',
      paddingBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: `#${tags[i].color}`,
      marginRight: '16px',
      marginBottom: '16px',
      borderRadius: '12px',
    }}>
      <span style={{
        fontFamily: 'Material Symbols Rounded',
        color: 'white',
        fontSize: '36px',
      }}>{convertUnicode(tags[i].icon)}</span>
      <span style={{
        fontFamily: 'Roboto',
        color: 'white',
        fontSize: '24px',
        fontWeight: 'semibold',
        marginLeft: '10px',
      }}>{tags[i].text}</span>
    </div>)
  }

  return new ImageResponse(
    (
      <div
        style={{
          // Added gradient background
          background: 'linear-gradient(to bottom right, #3478F6, #7B61FF)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          padding: '36px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
          }}
        >
          <img
            width="240px"
            height="240px"
            src={avatar}
            style={{
              borderRadius: 36,
              objectFit: 'cover',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              paddingLeft: '54px',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h1
                style={{
                  color: 'white',
                  fontSize: '72px',
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                {title}
              </h1>
              <h3
                style={{
                  color: 'white',
                  fontSize: '48px',
                  fontFamily: 'Roboto',
                  fontWeight: 'normal',
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)',
                }}
              >
                {subtitle}
              </h3>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                paddingRight: '210px',
              }}
            >
              {rows}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Material Symbols Rounded',
          data: fontData,
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Roboto',
          data: textFontData,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Roboto',
          data: textFontDataRegular,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
