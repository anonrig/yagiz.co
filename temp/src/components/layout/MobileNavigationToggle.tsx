import type { Item } from "@/types/layout";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { clsx } from "clsx";
import Container from "@/components/ui/Container";
import SubscribeButton from "@/components/SubscribeButton";

export function MobileNavigationToggle({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="px-4"
        onClick={() => setOpen(!open)}
        aria-label="Toggle mobile navigation menu visibility"
      >
        {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div
        className={clsx(
          "bg-white dark:bg-white-reversed h-mobile-overlay left-0 pt-12 fixed top-navigation-bar w-full z-navigation-bar z-[20] overflow-y-auto",
          { hidden: !open }
        )}
      >
        <Container>
          <nav className="flex flex-col gap-6">
            {items.map((item) => (
              // biome-ignore lint/a11y/useValidAnchor: <explanation>
              <a
                href={item.href}
                key={item.href}
                className="text-lg text-right font-bold"
                onClick={() => setOpen(false)}
              >
                {item.title}
              </a>
            ))}

            <SubscribeButton className="text-right text-lg" />
          </nav>
        </Container>
      </div>
    </>
  );
}
