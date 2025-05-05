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
  const { title, subtitle, tags, user } = body

  if (!title || !subtitle || !tags || !user) {
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
          background: 'linear-gradient(to bottom right, #4CAF50, #2196F3)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
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
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
                margin: 0,
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
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)',
                marginTop: '16px',
                marginBottom: '36px',
              }}
            >
              {subtitle}
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '48px',
            }}
          >
            {rows}
          </div>

          {/* User profile info */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '20px 32px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              alignSelf: 'flex-start',
            }}
          >
            <img
              width="72px"
              height="72px"
              src={user.avatar}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '16px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Roboto',
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '32px',
                }}
              >
                {user.name}
              </span>
              <span
                style={{
                  fontFamily: 'Roboto',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '24px',
                }}
              >
                {user.role}
              </span>
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
