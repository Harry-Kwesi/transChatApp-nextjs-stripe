"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useAdminId from "@/hooks/useAdminId";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";

function DeleteChatButton({ chatId }: { chatId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const adminId = useAdminId({ chatId });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    toast({
      title: "Deleting chat...",
      description: "Please wait while we delete the chat",
    });

    await fetch("/api/chat/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatId }),
    }).then(() => {
      toast({
        title: "Chat deleted",
        description: "Your chat has been deleted",
        className: "bg-green-600 text-white",
        duration: 3000,
      });

      router.replace("/chat");
    }).catch((error) => {
      toast({
        title: "Error",
        description: "An error occurred while deleting the chat",
        variant: "destructive"
      });
    })
    .finally(() => {
      setOpen(false);
    })
  };

  if (!session?.user.id) return null;
  if (adminId !== session?.user.id) return null;

  return (
    session?.user.id === adminId && (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-1" />
          Delete Chat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Delete
          </Button>
          <Button
            size="sm"
            className="px-3 flex-1"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>

)
  );
}

export default DeleteChatButton;