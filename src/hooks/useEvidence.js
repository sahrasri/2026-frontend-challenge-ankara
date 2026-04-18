import { useMemo } from "react";
import { useAsyncData } from "./useAsyncData";
import { getPersonalNotes } from "../api/personalNotes.crud";
import { getAnonymousTips } from "../api/anonymousTips.crud";
import {
  normalizeResponse,
  normalizePersonalNote,
  normalizeTip,
} from "../utils/normalize";

const norm = (s) => (s ?? "").toString().toLowerCase().trim();

/**
 * Check if timestamps match (within same day)
 */
const timestaysMatch = (ts1, ts2) => {
  if (!ts1 || !ts2) return false;
  if (!(ts1 instanceof Date) || !(ts2 instanceof Date)) return false;
  return (
    ts1.getFullYear() === ts2.getFullYear() &&
    ts1.getMonth() === ts2.getMonth() &&
    ts1.getDate() === ts2.getDate()
  );
};

/**
 * Fetches personal notes + anonymous tips (both endpoints) and returns
 * a `findRelated({ persons, location, timestamp })` function that picks out the
 * notes/tips matching a given investigation item. Full matches (person + location + time)
 * are marked with fullMatch flag.
 */
export const useEvidence = () => {
  const notesQuery = useAsyncData(getPersonalNotes);
  const tipsQuery = useAsyncData(getAnonymousTips);

  const notes = useMemo(
    () => normalizeResponse(notesQuery.data, normalizePersonalNote),
    [notesQuery.data],
  );
  const tips = useMemo(
    () => normalizeResponse(tipsQuery.data, normalizeTip),
    [tipsQuery.data],
  );

  const findRelated = useMemo(() => {
    return ({ persons = [], location = null, timestamp = null } = {}) => {
      const people = persons.map(norm).filter(Boolean);
      const loc = norm(location);

      const matchNote = (n) => {
        const mp = norm(n.mentionedPeople);
        const author = norm(n.author);
        const nl = norm(n.location);
        const byPerson = people.some((p) => mp.includes(p) || author === p);
        const byLocation = loc && nl === loc;
        const byTime = timestamp && timestaysMatch(n.timestamp, timestamp);
        const fullMatch = byPerson && byLocation && byTime;
        return { match: byPerson || byLocation, fullMatch };
      };

      const matchTip = (t) => {
        const suspect = norm(t.suspectName);
        const text = norm(t.tip);
        const tl = norm(t.location);
        const byPerson = people.some((p) => suspect === p || text.includes(p));
        const byLocation = loc && tl === loc;
        const byTime = timestamp && timestaysMatch(t.timestamp, timestamp);
        const fullMatch = byPerson && byLocation && byTime;
        return { match: byPerson || byLocation, fullMatch };
      };

      const matchedNotes = notes
        .map((n) => {
          const { match, fullMatch } = matchNote(n);
          return match ? { ...n, fullMatch } : null;
        })
        .filter(Boolean)
        .sort((a, b) => (b.fullMatch ? 1 : 0) - (a.fullMatch ? 1 : 0));

      const matchedTips = tips
        .map((t) => {
          const { match, fullMatch } = matchTip(t);
          return match ? { ...t, fullMatch } : null;
        })
        .filter(Boolean)
        .sort((a, b) => (b.fullMatch ? 1 : 0) - (a.fullMatch ? 1 : 0));

      return {
        notes: matchedNotes,
        tips: matchedTips,
      };
    };
  }, [notes, tips]);

  return {
    notes,
    tips,
    findRelated,
    loading: notesQuery.loading || tipsQuery.loading,
    error: notesQuery.error || tipsQuery.error,
  };
};
