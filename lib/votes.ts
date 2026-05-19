import type { VoteCount, VoteOption } from "@/types";

const store: Record<string, VoteCount> = {};

export function getVotes(slug: string): VoteCount {
  if (!store[slug]) store[slug] = { yes: 0, maybe: 0, no: 0 };
  return { ...store[slug] };
}

export function getVoteTotal(slug: string): number {
  const v = getVotes(slug);
  return v.yes + v.maybe + v.no;
}

export function addVote(slug: string, option: VoteOption): VoteCount {
  if (!store[slug]) store[slug] = { yes: 0, maybe: 0, no: 0 };
  store[slug][option] += 1;
  return { ...store[slug] };
}
