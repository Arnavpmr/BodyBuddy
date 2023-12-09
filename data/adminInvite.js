const { randomBytes } = await import("node:crypto");
import { adminInvites } from "../config/mongoCollections";

export const createAdminInvite = async () => {
  const hash = randomBytes(20).toString("hex");
  const adminInvitesCollection = await adminInvites();

  const entry = adminInvitesCollection.insertOne({ invite: hash });

  if (!entry.acknowledged || !entry.insertedId) {
    throw "Error in createAdminInvite: Unable to create admin invite";
  }

  return hash;
};

export const getAdminInviteById = async (inviteId) => {
  const adminInvitesCollection = await adminInvites();

  const invite = adminInvitesCollection.findOne({
    invite: inviteId,
  });

  if (!invite) throw "Error in getAdminInviteById: Unable to find invite";

  return invite;
};
