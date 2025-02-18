import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import ChatInput from "@/components/ChatInput";
import { getDocs } from "firebase/firestore";
import { limitedSortedMessagesRef } from "@/lib/converters/Message";
import ChatMessages from "@/components/ChatMessages";
import ChatMembersBadges from "@/components/ChatMembersBadges";

type Props = {
  params: {
    chatId: string
  }
}

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions)

  const initialMessages = (await getDocs(limitedSortedMessagesRef(chatId))).docs.map((doc) => doc.data());

  return (
    <>
       <div className="flex-1">
        <ChatMembersBadges chatId={chatId}/>
        <ChatMessages chatId={chatId} session={session} initialMessages={initialMessages}/>
       </div>
      <ChatInput chatId={chatId} />
    </>
  )
}

export default ChatPage