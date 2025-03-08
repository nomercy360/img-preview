import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

// Font Resources
const textFont = fetch(new URL('../../assets/Montserrat-Bold.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);
const textFontRegular = fetch(new URL('../../assets/Montserrat-Regular.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer()
);

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Moscow',
  })
}

// Match Notification Image Handler
export default async function httpPost(req: NextRequest) {
  if (req.method !== 'POST') {
    return new Response('Invalid method', { status: 405 })
  }

  const body = await req.json()
  const { homeTeam, awayTeam, matchDate, odds, homeCrest, awayCrest, tournament } = body

  if (!homeTeam || !awayTeam || !matchDate || !homeCrest || !awayCrest || !tournament) {
    return new Response('Missing parameters', { status: 400 })
  }

  const textFontData = await textFont
  const textFontDataRegular = await textFontRegular

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1E1E1E',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '40px',
        }}
      >
        <h2
          style={{
            opacity: 0.5,
            color: 'white',
            fontSize: '52px',
            fontFamily: 'Roboto',
            fontWeight: 'bold',
          }}
        >
          {tournament}
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: '20px',
          }}
        >
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}>
            <img src={homeCrest} width="150" height="150" style={{ borderRadius: '12px' }} />
            <h3
              style={{
                color: 'white',
                fontSize: '36px',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
              }}
            >
              {homeTeam}
            </h3>
          </div>
          <h2 style={{ color: 'white', fontSize: '72px', fontFamily: 'Roboto', fontWeight: 'bold' }}>VS</h2>
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}>
            <img src={awayCrest} width="150" height="150" style={{ borderRadius: '12px' }} />
            <h3
              style={{
                color: 'white',
                fontSize: '36px',
                fontFamily: 'Roboto',
                fontWeight: 'bold',
                marginTop: '10px',
              }}
            >
              {awayTeam}
            </h3>
          </div>
        </div>
        <h3
          style={{
            color: 'white',
            fontSize: '28px',
            opacity: 0.5,
            fontFamily: 'Roboto',
            fontWeight: 'normal',
            marginTop: '32px',
          }}
        >
          {formatDate(matchDate)} (Московское время)
        </h3>
        {/*<div*/}
        {/*  style={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'space-around',*/}
        {/*    width: '100%',*/}
        {/*    marginTop: '20px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <span style={{ color: 'white', fontSize: '32px', fontFamily: 'Roboto' }}>🏆 {odds.home} (Home)</span>*/}
        {/*  <span style={{ color: 'white', fontSize: '32px', fontFamily: 'Roboto' }}>⚖️ {odds.draw} (Draw)</span>*/}
        {/*  <span style={{ color: 'white', fontSize: '32px', fontFamily: 'Roboto' }}>🥇 {odds.away} (Away)</span>*/}
        {/*</div>*/}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
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
