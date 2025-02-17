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
import { serverTimestamp, setDoc } from 'firebase/firestore';
import { addChatRef } from '@/lib/converters/ChatMembers';




function CreateChatButton({isLarge }: {isLarge: boolean}) {
    const {data : session} = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {toast} =  useToast();
    const subscription =  useSubscriptionStore((state) => state.subscription);

    const createNewChat = async () => {
      if (!session?.user.id) return;

      setLoading(true);
      toast({
        title: "Creating Chat",
        description: "Please wait while we create your chat",
        duration: 3000,
      })

      const chatId = uuid();

      await setDoc(addChatRef(chatId, session.user.id), {
        userId: session.user.id,
        email: session.user.email,
        timestamp: serverTimestamp(),
        isAdmin: true,
        chatId: chatId,
        image: session.user.image || "",
      }).then(() => {
        toast({
          title: "Chat Created",
          description: "Your chat has been created",
          className:"bg-green-600 text-white",
          duration: 3000,
        });
        router.push(`/chat/${chatId}`);
      }).catch((error) => { 
        console.log("theerror", error)
        toast({
          title: "Error",
          description: "An error occurred while creating your chat",
          variant: "destructive"
        });
      }).finally(() => {
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