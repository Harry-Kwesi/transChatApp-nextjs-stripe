import ChatList from "@/components/ChatList";
import ChatPermissionError from "@/components/ChatPermissionError";

type Props = {
  params: {};
  searchParams: {
    error?: string; // Make it optional to prevent undefined errors
  };
};

function ChatsPage({ searchParams }: Props) {
  return (
    <div>
      {searchParams.error && ( 
        <div className="text-red-500">
          <ChatPermissionError />
        </div>
      )}
      <ChatList />
    </div>
  );
}

export default ChatsPage;
