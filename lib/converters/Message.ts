import {db} from '@/firebase';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions,collection, collectionGroup, doc, limit, orderBy, query, where } from "firebase/firestore";
import { LanguageSupported } from '@/store/store';

export interface User {
    id: string;
    email: string;
    name: string;
    image: string;
}

export interface Message {
    id: string;
    input: string;
    timestamp: Date;
    user: User;
    translated?:{
        [K in LanguageSupported]?:string;
    }
}

const messageConverter: FirestoreDataConverter<Message> = {
    toFirestore(message: Message): DocumentData {
        return {
            input: message.input,
            timestamp: message.timestamp,
            user: message.user,
        };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Message {
        const data = snapshot.data(options)!;
        const message: Message = {
            id: snapshot.id,
            input: data.input,
            timestamp: data.timestamp?.toDate(),
            translated: data.translated,
            user: data.user,
        };
        return message;
    }
};


    export const messagesRef = (chatId: string) => collection(db, "chats", chatId, "messages").withConverter(messageConverter);

    export const limitedMessagesRef = (chatId: string) => query(messagesRef(chatId),limit(25));

    export const sortMessagesRef = (chatId: string) => query(messagesRef(chatId),orderBy("timestamp", "asc"));


    export const limitedSortedMessagesRef = (chatId: string) => query(query(messagesRef(chatId),orderBy("timestamp", "asc"),limit(1)));

    