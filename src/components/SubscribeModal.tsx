import { $isSubscribeVisible } from "@/lib/stores";
import { useStore } from "@nanostores/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from "@radix-ui/react-form";
import { XIcon } from "lucide-react";
import { type FormEvent, useState } from "react";

export default function SubscribeModal() {
  const visible = useStore($isSubscribeVisible);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // biome-ignore lint/suspicious/noExplicitAny: Unnecessary
    const { email, name } = event.target as any;
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          name: name.value,
        }),
      });
      const json = await response.json();

      if (json.status === 200) {
        setMessage("");
        $isSubscribeVisible.set(false);
      } else {
        setMessage(json.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const modalRef = document.querySelector("#subscribe-modal");

  return (
    <dialog
      id="subscribe-modal"
      className="backdrop:bg-black/20 backdrop:backdrop-blur-sm"
    >
      <div className="z-[30] fixed md:top-[50%] md:left-[50%] max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] md:translate-x-[-50%] md:translate-y-[-50%] rounded-md bg-white dark:bg-black p-4 focus:outline-none overflow-y-scroll">
        <div className="mt-[16px] mb-[32px] flex flex-col items-center">
          <h2 className="my-4 text-black dark:text-white tracking-4 text-3xl font-extrabold tracking-tight">
            Yagiz Nizipli
          </h2>
        </div>
        <Form.Root onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          <Form.Field name="name" className="flex flex-col gap-y-2">
            <Form.Label className="text-sm text-black dark:text-white font-bold flex flex-col w-full">
              Name
            </Form.Label>
            <Form.Control
              type="text"
              required
              placeholder="John Doe"
              className="font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500"
            />
            <Form.Message
              className="text-sm text-black dark:text-white opacity-80"
              match="valueMissing"
            >
              Please enter your name
            </Form.Message>
            <Form.Message
              className="text-sm text-black dark:text-white opacity-80"
              match="typeMismatch"
            >
              Please provide a valid name
            </Form.Message>
          </Form.Field>

          <Form.Field name="email" className="flex flex-col gap-y-2">
            <Form.Label className="text-sm text-black dark:text-white font-bold flex flex-col w-full">
              Email
            </Form.Label>
            <Form.Control
              type="email"
              required
              placeholder="john@doe.com"
              className="font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500"
            />
            <Form.Message
              className="text-sm text-black dark:text-white opacity-80"
              match="valueMissing"
            >
              Please enter your email
            </Form.Message>
            <Form.Message
              className="text-sm text-black dark:text-white opacity-80"
              match="typeMismatch"
            >
              Please provide a valid email
            </Form.Message>
          </Form.Field>

          <Form.Submit
            disabled={loading}
            className="disabled:opacity-60 mt-4 mb-4 w-full bg-orange-400 text-white dark:text-white-reversed h-[42px] px-[1.8rem] rounded-lg font-bold"
          >
            Subscribe
          </Form.Submit>

          {message.length > 0 && <div className="text-center">{message}</div>}
        </Form.Root>

        <div
          className="absolute cursor-pointer top-4 right-4 inline-flex appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
          arial-label="Close"
          onClick={() => {
            if (modalRef && "close" in modalRef) {
              modalRef.close();
            }
          }}
        >
          <XIcon size={24} className="text-neutral-300 m-2" />
        </div>
      </div>
    </dialog>
  );
}
