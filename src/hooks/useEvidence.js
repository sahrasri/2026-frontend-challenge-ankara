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
 * Fetches personal notes + anonymous tips (both endpoints) and returns
 * a `findRelated({ persons, location })` function that picks out the
 * notes/tips matching a given investigation item.
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
      const time = timestamp;

      const scoreNote = (n) => {
        const mp = norm(n.mentionedPeople);
        const author = norm(n.author);
        const nl = norm(n.location);

        let score = 0;
        const matchPersons = people.some((p) => mp.includes(p) || author === p);
        const matchLocation = loc && nl === loc;
        const matchTime =
          time &&
          n.timestamp &&
          Math.abs(n.timestamp.getTime() - time.getTime()) <
            24 * 60 * 60 * 1000; // within 24 hours

        if (matchPersons) score += 1;
        if (matchLocation) score += 1;
        if (matchTime) score += 1;

        return { match: score > 0, score, isPerfect: score === 3 };
      };

      const scoreTip = (t) => {
        const suspect = norm(t.suspectName);
        const text = norm(t.tip);
        const tl = norm(t.location);

        let score = 0;
        const matchPersons = people.some(
          (p) => suspect === p || text.includes(p),
        );
        const matchLocation = loc && tl === loc;
        const matchTime =
          time &&
          t.timestamp &&
          Math.abs(t.timestamp.getTime() - time.getTime()) <
            24 * 60 * 60 * 1000; // within 24 hours

        if (matchPersons) score += 1;
        if (matchLocation) score += 1;
        if (matchTime) score += 1;

        return { match: score > 0, score, isPerfect: score === 3 };
      };

      const matchedNotes = notes
        .map((n) => {
          const scoring = scoreNote(n);
          return { ...n, ...scoring };
        })
        .filter((n) => n.match);

      const matchedTips = tips
        .map((t) => {
          const scoring = scoreTip(t);
          return { ...t, ...scoring };
        })
        .filter((t) => t.match);

      // Sort by score descending (perfect matches first)
      matchedNotes.sort((a, b) => b.score - a.score);
      matchedTips.sort((a, b) => b.score - a.score);

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
