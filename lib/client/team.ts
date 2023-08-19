import { auth } from "@/lib/client/firebase";
import { doc } from "firebase/firestore";
import { db } from "@/lib/client/firebase";
import { useProfile } from "./profile";
import { useDocument } from "react-firebase-hooks/firestore";

// note - this file does not have unit tests because it simply wraps api calls

export interface Team {
  id: string;
  name: string;
  members: string[];
  avatar: string;
}

export async function createTeam(
  teamName: string,
  teamEmail: string
): Promise<void> {
  const res = await fetch("/api/team/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: (await auth.currentUser?.getIdToken(true)) || "",
      name: teamName,
      email: teamEmail,
    }),
  });
  console.log(res);

  const body = await res
    .clone()
    .json()
    .then((body) => body)
    .catch((error) => console.log(error));

  console.log(body);

  if (res.status > 210) {
    return Promise.reject();
  }
  return Promise.resolve();
}

export function useTeam() {
  const { profile, profileLoading, profileError } = useProfile();
  const [value, loading, error] = useDocument(
    doc(db, `teams/${profile?.teamId || "freeAgent"}`)
  );

  if (profile === undefined && !profileLoading) {
    return {
      team: undefined,
      teamLoading: false,
      teamError: profileError,
    };
  }

  const team: Team = {
    id: value?.data()?.id || "",
    name: value?.data()?.name || "",
    members: value?.data()?.members || [],
    avatar: value?.data()?.avatar || "",
  };

  return {
    team,
    teamLoading: loading,
    teamError: error,
  };
}

export async function createInvite() {
  const res = await fetch("/api/invite/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: (await auth.currentUser?.getIdToken(true)) || "",
    }),
  });

  const body = await res
    .clone()
    .json()
    .then((body) => body)
    .catch((error) => console.log(error));

  if (res.status > 210 || body.invite === undefined) {
    return Promise.reject();
  }
  return Promise.resolve(body.invite);
}

export async function joinTeam(invite: string) {
  const res = await fetch("/api/invite/consume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: (await auth.currentUser?.getIdToken(true)) || "",
      inviteId: invite,
    }),
  });

  if (res.status > 210) {
    const body = await res.clone().json();
    return Promise.reject(body.message);
  }

  return Promise.resolve();
}
