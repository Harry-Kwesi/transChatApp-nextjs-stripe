import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image'

function UserAvatar({name, image, className}:{name:string, image: string, className:string}) {
  return (
<Avatar className={cn("bg-white text-black", className)}>
    {image && (
    <Image
      src={image}
      width={500}
      height={500}
      alt={name}
      className=""
    />)}
    <AvatarFallback delayMs={1000} className="dark:bg-white dark:text-black text-lg">
    { name?.match(/\b\w/g)?.join("")}
    </AvatarFallback>
</Avatar>

  )
}

export default UserAvatar