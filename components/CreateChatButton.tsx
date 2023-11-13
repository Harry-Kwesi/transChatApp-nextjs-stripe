'use client'

import { useRouter } from 'next/navigation';
import { Button } from './ui/button'
import { Ghost, MessageSquarePlusIcon } from "lucide-react";

function CreateChatButton() {

    const router = useRouter();

    const createNewChat = async () => {
        
    }
    
  return (
    <Button onClick={createNewChat} variant={"ghost"}><MessageSquarePlusIcon/></Button>
  )
}

export default CreateChatButton