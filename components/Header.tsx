import { getServerSession } from "next-auth";
import Logo from "./Logo";
import DarkModeToggle from "./DarkModeToggle";
import UserButton from "./UserButton";
import { authOptions } from "@/auth";
import Link from "next/link";
import { MessagesSquareIcon } from "lucide-react";

const Header = async () => {
  const session = await getServerSession(authOptions);
  console.log("url", session);
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav className="flex flex-col sm:flex-row items-center p-5 pl-2 bg-white dark:bg-gray-900 max-w-7xl mx-auto">
        <Logo />
        <div className="flex-1 flex items-center justify-end space-x-4"></div>

        {session && (
          <>
            <Link href={"/chat"} prefetch={false}>
           <MessagesSquareIcon/>
            </Link>
          </>
        )}
        <DarkModeToggle />
        <UserButton />
      </nav>
    </header>
  );
};

export default Header;
