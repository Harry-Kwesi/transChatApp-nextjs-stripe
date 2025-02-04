import Link from "next/link";
// import LogoImage from "../Images/Logos/log.svg";
// import { AspectRatio } from "./ui/aspect-ratio";
// import Image from 'next/image'
import { MessageSquare } from "lucide-react";

const Logo = () => {
  return (
    <>
      {/* <Link href="/" prefetch={false} className="oveflow-hidden">
      <div className="flex items-center w-52 h-4 mt-16 ">
      <AspectRatio ratio={14 / 9}
      className="flex items-center justify-between"
      >
     <Image priority src={LogoImage} alt="Logo" className="dark:filter dark:invert" /> 
  </AspectRatio>
        </div>
        </Link> */}
          <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">TransChat</span>
          </div>
    </>
  );
};

export default Logo;
