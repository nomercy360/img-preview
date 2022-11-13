import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

function convertUnicode(input) {
  // material symbols example input: "f05d"
  return String.fromCodePoint(parseInt(input, 16))
}

// Make sure the font exists in the specified path:
const font = fetch('https://d262mborv4z66f.cloudfront.net/icons.TTF').then(
  (res) => res.arrayBuffer(),
)

const textFont = fetch(new URL('../../assets/Roboto-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
)

const textFontRegular = fetch(new URL('../../assets/Roboto-Regular.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
)

export default async function httpPos(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 })
  }

  const auth = req.headers.get('x-api-key')
  if (auth !== process.env.APP_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { title, subtitle, avatar, tags, color } = body


  if (!title || !subtitle || !color || !avatar || !tags) {
    return new ImageResponse(<>Doesn't exist</>, {
      width: 1200,
      height: 630,
    })
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
      backgroundColor: 'white',
      marginRight: '16px',
      marginBottom: '16px',
      borderRadius: '12px',
    }}>
      <span style={{
        fontFamily: 'Material Symbols Rounded',
        color: `${tags[i].color}`,
        fontSize: '40px',
      }}>{convertUnicode(tags[i].icon)}</span>
      <span style={{
        fontFamily: 'Roboto',
        color: '#100f0f',
        fontSize: '36px',
        fontWeight: 'normal',
        marginLeft: '10px',
      }}>{tags[i].label}</span>
    </div>)
  }

  return new ImageResponse(
    (
      <div style={{
        backgroundColor: '#' + color,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '36px',
        borderRadius: '24px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          height: '100%',
        }}>
          <img
            width='200'
            height='200'
            src={avatar}
            style={{
              borderRadius: 40,
              objectFit: 'cover',
            }}
          />
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingLeft: '54px',
            height: '100%',
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
              <h1 style={{
                color: 'white',
                fontSize: '72px',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}>{title}</h1>
              <h3 style={{
                color: 'white',
                fontSize: '48px',
                fontFamily: 'Roboto',
                fontWeight: 'normal',
              }}>{subtitle}</h3>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              paddingRight: '180px',
            }}>
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
