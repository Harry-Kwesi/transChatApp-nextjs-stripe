import Link from "next/link";
import LogoImage from "../Images/Logos/log.svg";
import { AspectRatio } from "./ui/aspect-ratio";
import Image from 'next/image'

const Logo = () => {
  return (
    <>
      <Link href="/" prefetch={false} className="oveflow-hidden">
      <div className="flex items-center w-52 h-4 mt-10 ">
      <AspectRatio ratio={14 / 9}
      className="flex items-center justify-between"
      >
     <Image priority src={LogoImage} alt="Logo" className="dark:filter dark:invert" /> 
  </AspectRatio>
        </div>
        </Link>
    </>
  );
};

export default Logo;
