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
  <AvatarFallback className="">
    { name ?.split("").map((n) => n[0]).join("")
    }</AvatarFallback>
</Avatar>

  )
}

export default UserAvatar