'use client'
import { subscriptionRef } from "@/lib/converters/Subscription";
import { useSubscriptionStore } from "@/store/store";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const setSubscription = useSubscriptionStore((state) => state.setSubscription);

  useEffect(() => {  
    if (!session?.user?.id) return;

    const unsubscribe = onSnapshot(subscriptionRef(session.user.id), (snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        setSubscription(null);
      } else { 
        console.log("User has a subscription");
        setSubscription(snapshot.docs[0].data());
      }
    }, (error) => {
      console.error("Error getting documents: ", error);
    });

    return () => unsubscribe(); // Ensure cleanup

  }, [session?.user?.id, setSubscription]); // Avoid unnecessary re-renders

  return <>{children}</>;
}

export default SubscriptionProvider;
