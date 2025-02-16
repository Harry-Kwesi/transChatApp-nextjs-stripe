'use client'

import { db } from "@/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react"
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useSubscriptionStore } from "@/store/store";
import ManageAccountButton from "./ManageAccountButton";


function CheckoutButton() {
const {data:session} = useSession();
const [loading, setLoading] = useState(false)
const subscription = useSubscriptionStore((state) => state.subscription);

const isLoadingSubscription = subscription === undefined;

const isSuscribed = subscription?.role === 'pro';

  const createCheckoutSession = async () => {
      if(!session?.user.id) return;

      setLoading(true)

      const docRef = await addDoc(
        collection(db, 'customers', session.user.id, 'checkout_sessions'), {
        price:'price_1OgiwJSAwBBmWXf8acP3A6Hy',
        success_url: window.location.origin,
        cancel_url: window.location.origin
      })

      return onSnapshot(docRef, snap => {
        const data = snap.data();
        const url = data?.url
        const error = data?.error;
        if (error){
          // show an error to customer
          // inspect your cloud function logs in your firebase console
          alert(`An error occured: ${error.message}`);
          setLoading(false);
        }

        if (url){
          // we have a stripe checkout url, lets redirect
          window.location.assign(url)
          setLoading(false);
        }
      })
  }

  return (
    <div className='flex flex-col space-y-2'>
   <div className="mt-8 block rounded-md bg-indigo-500 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible-outline focus-visible-outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80">
   { isSuscribed ? <ManageAccountButton/> : isLoadingSubscription ||
    loading ? <LoadingSpinner/> : 
    <button  onClick={()=> createCheckoutSession()}  >
     Sign Up
    </button>
}
    </div>
   </div>
  )
}

export default CheckoutButton