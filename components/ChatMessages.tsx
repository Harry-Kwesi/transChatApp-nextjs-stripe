"use client";

import { Message, sortMessagesRef } from "@/lib/converters/Message";
import { useLanguageStore } from "@/store/store";
import { MessageCircleIcon } from "lucide-react";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import LoadingSpinner from "./LoadingSpinner";
import UserAvatar from "./UserAvatar";

export default function ChatMessages({
  chatId,
  session,
  initialMessages,
}: {
  chatId: string;
  session: Session | null;
  initialMessages: Message[];
}) {
  const language = useLanguageStore((state) => state.language);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, loading, error] = useCollectionData<Message>(
    sortMessagesRef(chatId),
    {
      initialValue: initialMessages,
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="p-5">
      {!loading && messages?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 rounded-xl space-y-2 bg-indigo-400 text-white font-extralight">
          <MessageCircleIcon className="w-10 h-10" />
          <h2 className="text-center">
            <span className="font-bold">Invite a friend</span> <br />
            <span className="font-bold">
              Send your first message in any language
            </span>
            <br />
            Below to get started
          </h2>
          <p>The AI will auto-detect and translate it all for you</p>
        </div>
      )}

      {messages?.map((message) => {
        const isSender = message.user.id === session?.user.id;

        return (
          <div key={message.id} className="flex my-2 items-end">
            <div
              className={`flex flex-col relative space-y-2 p-4 w-fit mx-2 rounded-lg ${
                isSender
                  ? "ml-auto bg-violet-600 text-white rounded-br-none"
                  : "bg-gray-100 dark:text-gray-100 dark:bg-slate-700 rounded-bl-none"
              }`}
            >
              <p
                className={`text-xs italic font-extralight ${
                  isSender ? "text-right" : "text-left"
                }`}
              >
                {message.user.name.charAt(0)}
              </p>

              <div className="flex space-x-2">
                <p>{message.translated?.[language] || message.input}</p>

                {/* {!message.translated && <LoadingSpinner />} */}
              </div>
            </div>

            <UserAvatar
               name={message.user.name}
               image={message.user.image}
               className={`isSender ? && "-order-1"`}
            />
          </div>
        );
      })}

      {/* Empty div to allow auto-scroll to the latest message */}
      <div ref={messagesEndRef} />
    </div>
  );
}
