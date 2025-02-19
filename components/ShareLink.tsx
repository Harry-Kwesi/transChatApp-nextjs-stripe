"use client";

import { Dispatch, SetStateAction } from "react";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";


function ShareLink({
  isOpen,
  setIsOpen,
  chatId,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  chatId: string;
}) {
  const { toast } = useToast();
  const host = window.location.host;
  const linkToShare = process.env.NODE_ENV === "development" 
    ? `http://${host}/chat/${chatId}`
    : `https://${host}/chat/${chatId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(linkToShare);
      toast({
        title: "Copied Successfully",
        description: "Share this link with people you want to invite to the chat!",
        className: "bg-green-600 text-white",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Copy className="mr-2" />
          Copy Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Copy Link</DialogTitle>
          <DialogDescription>
            Copy the link to share this chat with others.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
          <Input value={linkToShare} readOnly />
          <Label htmlFor="link" className="sr-only">Link</Label>
          
          </div>
          <Button size="icon" onClick={copyToClipboard}> 
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button variant="secondary">Close</Button>
        </DialogClose>
        </DialogFooter>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Share this link with others to grant them access to this chat (Only admin can generate links)
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ShareLink;
