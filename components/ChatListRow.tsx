'use client'

import { useCollectionData } from "react-firebase-hooks/firestore";
import { Skeleton } from "./ui/skeleton";
import { Message, limitedSortedMessagesRef } from "@/lib/converters/Message";


function ChatListRow({chatId}:{chatId:string}) {
    const [messages, loading, error] = useCollectionData<Message>(
        limitedSortedMessagesRef(chatId)
    )
  return (
    <>
      {loading && (
        <div className="flex p-5 items-center space-x-2" >
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2 flex-1">
             <Skeleton className="h-4  w-full"/>
             <Skeleton className=" h-4 w-1/4"/>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatListRow;