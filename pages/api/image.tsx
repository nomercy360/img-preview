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
const font = fetch(new URL('../../assets/icons.TTF', import.meta.url)).then(
  (res) => res.arrayBuffer(),
)

export default async function handler(req: NextRequest) {
  // check authorization
  const auth = req.headers.get('x-api-key')
  if (auth !== process.env.APP_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  const { searchParams } = req.nextUrl
  const title = searchParams.get('title')
  const subtitle = searchParams.get('subtitle')
  const avatar = searchParams.get('avatar')
  const tagsStr = searchParams.get('tags')
  const tags = tagsStr.split('|').map((tag) => tag.split(','))

  // const tags = searchParams.get('tags')
  const color = searchParams.get('color')
  if (!title || !subtitle || !color || !avatar) {
    return new ImageResponse(<>Doesn't exist</>, {
      width: 1200,
      height: 630,
    })
  }
  const fontData = await font

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
        color: '#405ac4',
        fontSize: '40px',
      }}>{convertUnicode(tags[i][1])}</span>
      <span style={{
        color: '#100f0f',
        fontSize: '36px',
        fontWeight: 'normal',
        marginLeft: '10px',
      }}>{tags[i][0]}</span>
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
                fontWeight: 'bold',
              }}>{title}</h1>
              <h3 style={{
                color: 'white',
                fontSize: '48px',
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
      ],
    },
  )
}
