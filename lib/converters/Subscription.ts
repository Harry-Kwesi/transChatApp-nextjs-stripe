import {db} from '@/firebase';
import { Subscription } from '@/types/Subscription';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions,collection } from "firebase/firestore";


const subscriptionConverter: FirestoreDataConverter<Subscription> = {
    toFirestore(subscription: Subscription): DocumentData {
        return {
        metadata: subscription.metadata,
        stripeLink: subscription.stripeLink,
        role: subscription.role,
        quantity: subscription.quantity,
        items: subscription.items,
        product: subscription.product,
        price: subscription.price,
        prices: subscription.prices,
        payment_method: subscription.payment_method,
        latest_invoice: subscription.latest_invoice,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        created: subscription.created,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Subscription {
        const data = snapshot.data(options)!;
        console.log("subscription", data.metadata);
        return {
        id: snapshot.id,
        metadata: data.metadata,
        stripeLink: data.stripeLink,
        role: data.role,
        quantity: data.quantity,
        items: data.items,
        product: data.product,
        price: data.price,
        prices: data.prices,
        payment_method: data.payment_method,
        latest_invoice: data.latest_invoice,
        status: data.status,
        cancel_at_period_end: data.cancel_at_period_end,
        created: data.created,
        current_period_start: data.current_period_start,
        current_period_end: data.current_period_end,
        ended_at: data.ended_at,
        cancel_at: data.cancel_at,
        canceled_at: data.canceled_at,
        trial_start: data.trial_start,
        trial_end: data.trial_end,
        };
    },
    };

    export const subscriptionRef = (userId: string) => collection(db, "customers", userId, "subscriptions").withConverter(subscriptionConverter);
    