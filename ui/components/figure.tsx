import Image from 'next/image'

export default function Figure(props: {
  caption?: string
  src: string
  alt: string
}) {
  return (
    <figure className='col-wide mt-[4.5rem]'>
      <div className='relative z-10 bg-gray-100 before:block before:pb-[50%] before:content-[""]'>
        <Image
          alt={props.alt}
          src={props.src}
          fill
          sizes='920px'
          placeholder='empty'
          className='object-cover duration-300 ease-in-out'
          priority
        />
      </div>
      {props.caption !== undefined && (
        <figcaption className='mt-6 text-xl text-slate-500'>
          {props.caption}
        </figcaption>
      )}
    </figure>
  )
}
