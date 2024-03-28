import { EmbedBuilder } from 'discord.js';
import jsoning from "jsoning";
import { config } from '../config.js';

const Database = new jsoning("guild.json");

export async function RoleCheck(RoleId) {
  const result = await Database.get("Roles")
  if (!result.includes(RoleId)) {
    return false;
  } else if (result.includes(RoleId)) {
    return true;
  }
}

export async function ReturnRoles() {
  const result = await Database.get("RoleNames")
  return result;
}

export async function ReturnRoleIDs() {
  const result = await Database.get("Roles")
  return result;
}

export async function AddRole(RolesId, RoleTag) {
  await Database.push("Roles", RolesId);
  await Database.push("RoleNames", RoleTag);
}

export async function Ban(BanId) {
  await Database.push("VCBanIds", BanId);
}

export async function UnBan() {
  await Database.delete("VCBanIds");
}

export async function ReturnBanList() {
  const result = await Database.get("VCBanIds")
  return result;
}
