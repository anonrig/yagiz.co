import { $isSubscribeVisible } from "@/lib/stores";
import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const subscribeButtonVariants = cva("text-orange-400", {
  variants: {
    variant: {
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "bold",
  },
});

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof subscribeButtonVariants> {
  label?: string;
}

export default function SubscribeButton({ className, variant, label }: Props) {
  const modal = document.querySelector("#subscribe-modal");
  return (
    <button
      type="button"
      className={subscribeButtonVariants({ variant, className })}
      onClick={() => {
        if (modal && "showModal" in modal) {
          modal?.showModal();
        }
      }}
    >
      {label ?? "Subscribe"}
      <span className="sr-only">to the newsletter</span>
    </button>
  );
}
