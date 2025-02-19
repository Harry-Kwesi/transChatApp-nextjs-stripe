import { db } from "@/firebase";
import { Subscription } from "@/types/Subscription";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: function (user: User): DocumentData {
    return {
      email: user.email,
      name: user.name,
      image: user.image,
    };
  },
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): User {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      email: data.email,
      name: data.name,
      image: data.image,
    };
  },
};

export const usersRef = collection(db, "users").withConverter(userConverter);

export const getUserByEmailRef = (email: string) => 
  query(usersRef, where("email", "==", email));

export async function getUserByEmail(email: string) {
  const querySnapshot = await getDocs(getUserByEmailRef(email));
  
  if (querySnapshot.empty) return null;
  
  return querySnapshot.docs[0].data();
}
