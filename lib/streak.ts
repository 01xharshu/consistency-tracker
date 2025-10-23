
import { format, subDays } from "date-fns";

export function computeStreak(
  completedKeys: Set<string>,
  today = new Date(),
  target = 30
) {
  let streak = 0;
  for (let i = 0; i < target; i++) {
    const key = format(subDays(today, i), "yyyy-MM-dd");
    if (completedKeys.has(key)) streak++;
    else break;
  }
  const pct = (streak / target) * 100;
  return { streak, pct };
}
