import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import ChatInput from "@/components/ChatInput";
import { getDocs } from "firebase/firestore";
import { limitedSortedMessagesRef } from "@/lib/converters/Message";
import ChatMessages from "@/components/ChatMessages";
import ChatMembersBadges from "@/components/ChatMembersBadges";
import AdminControls from "@/components/AdminControls";
import { chatMembersRef } from "@/lib/converters/ChatMembers";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string
  }
}

async function ChatPage({ params: { chatId } }: Props) {
  const session = await getServerSession(authOptions)

  const initialMessages = (await getDocs(limitedSortedMessagesRef(chatId))).docs.map((doc) => doc.data());

  const hasAccess = (await getDocs(chatMembersRef(chatId))).docs.map((doc) => doc.id).includes(session?.user.id);

  if (!hasAccess) redirect('/chat?error=permission')

  return (
    <>
       <div className="flex-1">
        <AdminControls chatId={chatId}/>
        <ChatMembersBadges chatId={chatId}/>
        <ChatMessages chatId={chatId} session={session} initialMessages={initialMessages}/>
       </div>
      <ChatInput chatId={chatId} />
    </>
  )
}

export default ChatPage