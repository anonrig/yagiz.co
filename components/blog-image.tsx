/* eslint-disable @next/next/no-img-element */

import { githubImage } from "@/app/content";

export default function BlogImage({ title }: { title: string }) {
  return (
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
          fontSize: 130,
          letterSpacing: '-0.05em',
          fontStyle: 'normal',
          color: 'black',
          lineHeight: '120px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: 100,
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
          alt='Yagiz Nizipli'
          width='140'
          height='140'
          src={githubImage}
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
  )
}
