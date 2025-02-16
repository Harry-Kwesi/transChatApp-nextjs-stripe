"use server"
import { authOptions } from "@/auth"
import { adminDb } from "@/firebase-admin"
import { getServerSession } from "next-auth"
import {headers} from "next/headers"
import { redirect } from "next/navigation"
import Stripe from "stripe"
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
});

export async function generatePortalLink() {
    const session = await getServerSession(authOptions);
    const host = headers().get("host");

    if (!session?.user?.id) {
        console.log("No user id found");
        return;
    }

    const { user: { id } } = session; // Correctly extract the user ID

    const returnUrl = process.env.NODE_ENV === "development" 
        ? `http://${host}/register` 
        : `https://${host}/register`;

    const doc = await adminDb.collection("customers").doc(id).get();

    if (!doc.exists) {
        console.log("No customer record was found with this user id");
        return;
    }

    const stripeId = doc.data()?.stripeId;

    const stripeSession = await stripe.billingPortal.sessions.create({
        customer: stripeId,
        return_url: returnUrl,
    });

    redirect(stripeSession.url);
}
