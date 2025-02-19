"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addChatRef, chatMembersRef } from "@/lib/converters/ChatMembers";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getUserByEmailRef } from "@/lib/converters/Users";
import { useToast } from "@/hooks/use-toast";
import useAdminId from "@/hooks/useAdminId";
import { PlusCircleIcon } from "lucide-react";
import ShareLink from "./ShareLink";
import { useSubscriptionStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { getDocs, setDoc, serverTimestamp } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function InviteUser({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const adminId = useAdminId({ chatId });
  const { toast } = useToast();
  const subscription = useSubscriptionStore((state) => state.subscription);
  const isPro = subscription?.role === "pro";

  const [open, setOpen] = useState(false);
  const [openInviteLink, setOpenInviteLink] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user.email) return;

    // Prevent adding yourself
    if (values.email === session.user.email) {
      toast({
        title: "Error",
        description: "You cannot invite yourself!",
        variant: "destructive",
      });
      return;
    }

    // Check user limit for free plan
    if (!isPro) {
      const snapshot = await getDocs(chatMembersRef(chatId));
      const noOfUsersInChat = snapshot.docs.length;
      if (noOfUsersInChat >= 2) {
        toast({
          title: "Free Plan Limit Reached",
          description: "You have exceeded the limit for free users. Please upgrade to pro to continue using the app.",
          variant: "destructive",
          action: (
            <ToastAction 
              altText="Upgrade to Pro" 
              className="bg-violet-600 text-white"
              onClick={() => router.push("/register")}
            >
              Upgrade
            </ToastAction>
          )
        });
        return;
      }
    }

    // Check if user exists
    const querySnapshot = await getDocs(getUserByEmailRef(values.email));
    if (querySnapshot.empty) {
      toast({
        title: "Error",
        description: "This user does not exist!",
        variant: "destructive",
      });
      return;
    }

    // Add user to chat
    const user = querySnapshot.docs[0].data();
    await setDoc(
      addChatRef(chatId, user.id),
      {
        email: values.email,
        timestamp: serverTimestamp(),
        isAdmin: false,
        chatId: chatId,
        userId: user.id,
        image: user.image || "",
      },
      { merge: true }
    ).then(() => {
      toast({
        title: "Success",
        description: "User has been invited!",
        className: "bg-green-600 text-white",
      });

      form.reset();
      setOpen(false);
      setOpenInviteLink(true);
    }).catch(() => {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    });
    
  }

  if (!session?.user.id) return null;
  if (adminId !== session?.user.id) return null;

  return (
   adminId === session?.user.id && (

   <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircleIcon className="mr-1" />
            Add User to Chat
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add User to Chat</DialogTitle>
            <DialogDescription>
              Enter the email of the user you want to add to this chat{" "}
              <span className="text-indigo-600 font-bold">
                (Note: They must be registered with the app)
              </span>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-2"
            >
              <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <Button className="ml-auto sm:w-fit w-full" type="submit">
                  Add to Chat
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
       <ShareLink isOpen={openInviteLink} setIsOpen={setOpenInviteLink} chatId={chatId} /> 
      </>
   )
  );
}