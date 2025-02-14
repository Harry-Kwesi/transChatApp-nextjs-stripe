// 'use client'
// import { useSubscriptionStore } from "@/store/store";
// import { useRouter } from "next/navigation";
// import { Button } from "./ui/button";



// export default function UpgradeBanner() {
//     const subscription = useSubscriptionStore((state) => state.subscription);
//     const isPro = subscription?.role === "pro";
//     const router = useRouter();


//      if (subscription || isPro) return null; // Hide the banner if the user is already subscribed or is a pro user


//   return (
//      <Button
//      onClick={() => router.push("/register")}
//      className="w-full rounded-none bg-gradient-to-r from-[#7775D6] to-[#E935C1] text-center text-white px-5 py-2
//      hover:from-[#7775D6] hover:to-[#E935C1] hover:shadow-md hover:opacity-75 transition-all"
//      >
//         Upgrade to Pro to unlock all features
//      </Button>
//   )
// }

'use client'

import { useSubscriptionStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const GRADIENT_CLASSES = "bg-gradient-to-r from-[#7775D6] to-[#E935C1]";

export default function UpgradeBanner() {
    const subscription = useSubscriptionStore((state) => state.subscription);
    const isPro = subscription?.role === "pro";
    const router = useRouter();

    // Hide banner if user has subscription or is pro
    if (subscription || isPro) return null;

    return (
        <Button
            onClick={() => router.push("/register")}
            className={`
                w-full 
                rounded-none 
                ${GRADIENT_CLASSES}
                text-center 
                text-white 
                px-5 
                py-2
                hover:opacity-75 
                hover:shadow-md 
                transition-all
            `}
        >
            Upgrade to Pro to unlock all features
        </Button>
    );
}