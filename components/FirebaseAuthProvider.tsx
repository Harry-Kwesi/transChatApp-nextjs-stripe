"use client";

import { auth } from "@/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";

async function syncFirebaseAuth(session: Session | null) {
    if (session?.firebaseToken) {
        try {
            await signInWithCustomToken(auth, session.firebaseToken);
        } catch (error) {
            console.error("Error signing in with custom token:", error);
        }
    }
}

export default function FirebaseAuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();

    useEffect(() => {
        syncFirebaseAuth(session);
    }, [session]);

    return <>{children}</>;
}
