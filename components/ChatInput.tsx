'use client';

import { useSession } from "next-auth/react"
import { addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { limitedMessagesRef, messagesRef, User } from "@/lib/converters/Message";
import { useRouter } from "next/navigation";
import { useSubscriptionStore } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";



const formSchema = z.object({
    input: z.string().max(1000),
})


export default function ChatInput({chatId}:{chatId:string}) {
    const {data: session} = useSession()
    const router = useRouter()
    const { toast } = useToast();
    const subscription = useSubscriptionStore((state) => state.subscription);
    const isPro = subscription?.role === "pro";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            input: ""
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
       if (values.input.length === 0) {
           return;
       }
       if (!session?.user) {
           return;
       }

       const messages = (await getDocs(limitedMessagesRef(chatId))).docs.map((doc) => doc.data()).length;

       if (messages >= 10 && !isPro) {
           return toast({
               title: "Upgrade to Pro",
               description: "You have reached the message limit for free users. Please upgrade to pro to continue using the app.",
               variant: "destructive",
               action: (
                <ToastAction altText="Upgrade to Pro" className="bg-violet-600 text-white">Upgrade</ToastAction>
               )
           })
       }

       const userToStore: User = {
        ...session.user,
       }

       addDoc(messagesRef(chatId), {
           input: values.input,
           timestamp: serverTimestamp(),
           user: userToStore,
           id: "",
           translated: {},
       })

       form.reset()

    }

    return (
        <div className="sticky bottom-0">
            <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex space-x-2 p-2 rounded-t-xl  max-w-4xl mx-auto bg-white border  dark:bg-slate-800"
            >
                <FormField
                control={form.control}
                name="input"
                render={({field}) => (
                    <FormItem className="flex-1">
                       <FormControl>
                        <Input
                        className="border-none background-transparent dark:placeholder:text-white/70" 
                        // disabled={!session}
                        placeholder="Enter message in ANY language"
                        {...field}
                        />
                       </FormControl>
                       <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="bg-violet-600  text-white">
                    Send
                </Button>
            </form>
            </Form>
        </div>
    )
}
