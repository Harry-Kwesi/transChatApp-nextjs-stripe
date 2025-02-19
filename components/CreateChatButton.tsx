'use client'

import { useRouter } from 'next/navigation';
import { Button } from './ui/button'
import { Ghost, MessageSquarePlusIcon } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useSubscriptionStore } from '@/store/store';
import LoadingSpinner from './LoadingSpinner';
import {v4 as uuid} from 'uuid';
import { getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef, chatMembersCollectionGroupRef } from '@/lib/converters/ChatMembers';
import { ToastAction } from "./ui/toast";

function CreateChatButton({isLarge }: {isLarge: boolean}) {
    const {data : session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {toast} =  useToast();
    const subscription =  useSubscriptionStore((state) => state.subscription);
    const isPro = subscription?.role === "pro";

    const createNewChat = async () => {
      if (!session?.user.id) return;

      setLoading(true);
      toast({
        title: "Creating new chat...",
        description: "Please wait while we create your new chat",
        duration: 3000,
      })

      const chatSnapshot = await getDocs(
        chatMembersCollectionGroupRef(session.user.id)
      );

      const numberOfChats = chatSnapshot.docs.length;

      if (!isPro && numberOfChats >= 3) {
        toast({
          title: "Free plan limit exceeded",
          description:
            "You've reached the limit of chats for the FREE plan. Upgrade to PRO for unlimited chats!",
          variant: "destructive",
          action: (
            <ToastAction
              altText="Upgrade"
              onClick={() => router.push("/register")}
            >
              Upgrade to PRO
            </ToastAction>
          ),
        });

        setLoading(false);
        return;
      }

      const chatId = uuid();

      await setDoc(addChatRef(chatId, session.user.id), {
        userId: session.user.id,
        email: session.user.email,
        timestamp: serverTimestamp(),
        isAdmin: true,
        chatId: chatId,
        image: session.user.image || "",
      })
      .then(() => {
        toast({
          title: "Success",
          description: "Your new chat has been created!",
          className: "bg-green-600 text-white",
          duration: 2000,
        });
        router.push(`/chat/${chatId}`);
      })
      .catch((error) => { 
        console.log("theerror", error)
        toast({
          title: "Error",
          description: "There was an error creating your chat!",
          variant: "destructive"
        });
      })
      .finally(() => {
        setLoading(false);
      });   

  }

    if(isLarge) {
        return (
            <Button onClick={createNewChat} variant={"default"}><MessageSquarePlusIcon/>
            {loading ? <LoadingSpinner/> : "Create a New Chat"}
            </Button>
        )
      }
    
  return (
    <Button onClick={createNewChat} variant={"ghost"}><MessageSquarePlusIcon/></Button>
  )
}

export default CreateChatButton