import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className='font-normal focus:border-slate-300 mt-[0.7rem] bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500'
      {...props}
    />
  )
}
