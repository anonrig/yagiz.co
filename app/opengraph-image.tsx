import { ImageResponse } from 'next/server'

export const size = { width: 1920, height: 1080 }
export const alt = 'Engineering with Yagiz'
export const contentType = 'image/png'

export default function og() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingLeft: 190,
          paddingRight: 190,
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 150,
            letterSpacing: '-0.05em',
            fontStyle: 'normal',
            color: 'black',
            lineHeight: '150px',
            whiteSpace: 'pre-wrap',
            fontWeight: 800,
          }}
        >
          Engineering with Yagiz
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 200,
            fontSize: 55,
            fontStyle: 'normal',
            color: 'black',
            lineHeight: '60px',
            whiteSpace: 'pre-wrap',
            flexDirection: 'row',
            justifyContent: 'center'
          }}
        >
          <img
            width='140'
            height='140'
            src='https:/github.com/anonrig.png'
            style={{
              borderRadius: 70
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: 50
            }}
          >
            <div
              style={{
                color: '#f97316',
              }}
            >
              Yagiz Nizipli
            </div>
            <div>Senior Software Engineer</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  )
}
