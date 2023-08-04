import { getAuth } from "firebase-admin/auth";
import initApp from "@/lib/server/admin";
initApp();

const auth = getAuth();

export async function getUid(request: Request): Promise<string> {
  const body = await request.json();
  let uid = "";

  const token: string = body.token;

  if (token === undefined) {
    return Promise.resolve("");
  }

  await auth.verifyIdToken(token).then((decodedToken) => {
    uid = decodedToken.uid;
  });

  return Promise.resolve(uid);
}