import clsx from "clsx";
import { TextareaHTMLAttributes } from "react";

export default function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'font-normal focus:border-slate-300 mt-[0.7rem] bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white text-xl h-[44px] outline-none px-6 dark:focus:border-neutral-500',
        'h-full py-6 resize-y min-h-[150px]'
      )}
      {...props}
    />
  )
}
