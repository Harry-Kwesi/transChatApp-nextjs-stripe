"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { useSubscriptionStore } from "@/store/store";
import LoadingSpinner from "./LoadingSpinner";
import { StarIcon } from "lucide-react";
import ManageAccountButton from "./ManageAccountButton";


export default function UserButton({ session }: { session: Session | null }) {
  const subscription = useSubscriptionStore((state) => state.subscription);

  if (!session) {
    return (
      <Button variant="outline" onClick={() => signIn()}>
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          name={session?.user?.name}
          image={session?.user?.image}
          className=""
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Show Loading Spinner while fetching subscription */}
        {subscription === undefined && (
          <DropdownMenuItem>
            <LoadingSpinner /> {/* Ensure this component exists */}
          </DropdownMenuItem>
        )}

        {/* Show "PRO" Badge if user has a Pro Subscription */}
        {subscription?.role === "pro" && (
          <DropdownMenuLabel className="text-xs flex items-center justify-center space-x-1 text-[#E935C1] animate-pulse">
            <StarIcon className="w-4 h-4 fill-[#E935C1]" />
            <span>PRO</span>
          </DropdownMenuLabel>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem><ManageAccountButton/></DropdownMenuItem>

        <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
