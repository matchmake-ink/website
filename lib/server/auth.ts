import { clientAuth } from "./firebase";
import { ERRORS } from "./errors";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getGravatarUrl } from "../gravatar";
import { db } from "./firebase";

import { AuthResponse } from "../interfaces";

export interface SignUpOptions {
  ign?: string;
  discordTag?: string;
}

export async function signInWithPassword(email: string, password: string) {
  let res: AuthResponse = {
    uid: "",
    email: "",
    token: "",
    avatar: "",
  };

  try {
    const { user } = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );

    res.token = await user.getIdToken();
    res.uid = user.uid;
    res.email = user.email === null ? "" : user.email;
    res.avatar =
      user.email === null
        ? "/images/user_placeholder.png"
        : getGravatarUrl(user.email);
  } catch (e) {
    throw ERRORS.AUTHENTICATION_FAILED;
  }

  return Promise.resolve(res);
}

export async function signUpWithPassword(
  email: string,
  password: string,
  options: SignUpOptions = {}
) {
  let res: AuthResponse = {
    uid: "",
    email: "",
    token: "",
    avatar: "",
  };

  try {
    if (db === undefined) throw ERRORS.MOCKING_BACKEND;

    const value = await createUserWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    console.log(value);
    const user = value.user;

    res.token = await user.getIdToken();
    res.uid = user.uid;
    res.email = user.email === null ? "" : user.email;
    res.avatar =
      user.email === null
        ? "/images/user_placeholder.png"
        : getGravatarUrl(user.email);

    await db.doc(`profiles/${res.uid}`).set({
      ign: options.ign ?? "",
      discordTag: options.discordTag ?? "",
      teamId: "",
      avatar: getGravatarUrl(email),
    });
  } catch (e) {
    throw ERRORS.AUTHENTICATION_FAILED;
  }

  return res;
}