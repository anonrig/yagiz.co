import { type VariantProps, cva } from "class-variance-authority";
import clsx from "clsx";

const figureVariants = cva("mt-6", {
  variants: {
    size: {
      wide: "col-wide",
      main: "col-main",
    },
  },
  defaultVariants: {
    size: "wide",
  },
});

interface Props extends VariantProps<typeof figureVariants> {
  className?: string;
  caption?: string;
  src: string;
  alt: string;
}

export default function Figure({ size, className, ...props }: Props) {
  return (
    <figure className={clsx(figureVariants({ size, className }))}>
      <img
        alt={props.alt}
        src={props.src}
        className="duration-300 ease-in-out bg-gray-100 aspect-video w-full object-cover object-center"
      />
      {props.caption !== undefined && (
        <figcaption className="mt-4 text-sm text-neutral-400">
          {props.caption}
        </figcaption>
      )}
    </figure>
  );
}
