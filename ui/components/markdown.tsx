import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { useMDXComponent } from 'next-contentlayer/hooks';
import { LinkHTMLAttributes, PropsWithChildren } from 'react';

function CustomLink(props: LinkHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href;

  if (href?.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target='_blank' rel='noopener noreferrer' {...props} />;
}

function RoundedImage({ alt, ...props}: ImageProps) {
  return (
    <Image
      alt={alt}
      fill
      className='rounded-lg object-contain w-full !h-[unset] !relative bg-white col-wide'
      sizes='100vw'
      {...props}
    />
  )
}

function Blockquote(props: PropsWithChildren<unknown>) {
  return (
    <blockquote className='border-l-[5px] border-orange-400 bg-gray-100 py-0.5 text-[2.1rem] font-bold not-italic tracking-tight text-slate-600'>
      {props.children}
    </blockquote>
  )
}

export default function Markdown({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return (
    <article className={clsx(
      'prose-quoteless prose prose-neutral text-2xl dark:prose-invert marker:text-black',
      'prose-h2:text-4xl prose-h2:font-extrabold', // h2
      'prose-h3:text-3xl prose-h3:font-extrabold prose-h3:text-slate-400', // h3
      'prose-strong:pr-2 prose-strong:font-bold', // strong
    )}>
      <Component
        components={{
          img: RoundedImage,
          a: CustomLink,
          blockquote: Blockquote,
        }}
      />
    </article>
  );
}
