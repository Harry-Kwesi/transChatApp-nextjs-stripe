import { authOptions } from "@/auth"
import { chatMembersCollectionGroupRef } from "@/lib/converters/ChatMembers"
import { getDocs } from "firebase/firestore"
import { getServerSession } from "next-auth"
import ChatListRows from "./ChatListRows"



async function ChatList() {
    const session = await getServerSession(authOptions)

    const chatSnapShot = await getDocs(
        chatMembersCollectionGroupRef(session?.user.id)
    );

    const initialChats = chatSnapShot.docs.map((doc) => ({
        ...doc.data(),
        timestamp:null,
    }));

  return  <ChatListRows initialChats={initialChats}/>
  
}

export default ChatList