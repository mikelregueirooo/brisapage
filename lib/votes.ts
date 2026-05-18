import { prisma } from "./prisma";
import type { VoteCount, VoteOption } from "@/types";

export async function getVotes(slug: string): Promise<VoteCount> {
  const rows = await prisma.vote.groupBy({
    by: ["option"],
    where: { eventSlug: slug },
    _count: { option: true },
  });
  const result: VoteCount = { yes: 0, maybe: 0, no: 0 };
  for (const r of rows) {
    result[r.option as VoteOption] = r._count.option;
  }
  return result;
}

export async function getVoteTotal(slug: string): Promise<number> {
  const v = await getVotes(slug);
  return v.yes + v.maybe + v.no;
}

export async function addVote(slug: string, option: VoteOption): Promise<VoteCount> {
  await prisma.vote.create({ data: { eventSlug: slug, option } });
  return getVotes(slug);
}
