import { getUid } from "@/lib/server/getUid";
import { noId, mustBeInTeam } from "@/lib/server/errors";
import { getFirestore } from "firebase-admin/firestore";
import { genRandomInviteCode } from "@/lib/server/random";

const db = getFirestore();

export async function POST(request: Request) {
  // TODO: don't send invites to users that are in a team already
  const creator = await getUid(request);

  if (creator === "") {
    return noId;
  }

  const teamId = (await db.doc(`profiles/${creator}`).get()).get("teamId");

  if (typeof teamId !== "string" || teamId === "") {
    return mustBeInTeam;
  }

  const inviteId = genRandomInviteCode();

  await db.doc(`invites/${inviteId}`).set({
    // 7 days from now
    team: teamId,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return new Response(JSON.stringify({ invite: inviteId }), {
    headers: {
      "content-type": "application/json",
    },
    status: 200,
  });
}
