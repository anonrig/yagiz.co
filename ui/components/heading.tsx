export default function Heading(props: { text: string }) {
  return (
    <h1 className='col-main text-[4rem] font-extrabold leading-[1.2] tracking-tight text-slate-800 dark:text-white'>
      {props.text}
    </h1>
  )
}
