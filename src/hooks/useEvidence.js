import { useMemo } from 'react';
import { useAsyncData } from './useAsyncData';
import { getPersonalNotes } from '../api/personalNotes.crud';
import { getAnonymousTips } from '../api/anonymousTips.crud';
import {
  normalizeResponse,
  normalizePersonalNote,
  normalizeTip,
} from '../utils/normalize';

const norm = (s) => (s ?? '').toString().toLowerCase().trim();

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
    [notesQuery.data]
  );
  const tips = useMemo(
    () => normalizeResponse(tipsQuery.data, normalizeTip),
    [tipsQuery.data]
  );

  const findRelated = useMemo(() => {
    return ({ persons = [], location = null } = {}) => {
      const people = persons.map(norm).filter(Boolean);
      const loc = norm(location);

      const matchNote = (n) => {
        const mp = norm(n.mentionedPeople);
        const author = norm(n.author);
        const nl = norm(n.location);
        const byPerson = people.some(
          (p) => mp.includes(p) || author === p
        );
        const byLocation = loc && nl === loc;
        return byPerson || byLocation;
      };

      const matchTip = (t) => {
        const suspect = norm(t.suspectName);
        const text = norm(t.tip);
        const tl = norm(t.location);
        const byPerson = people.some(
          (p) => suspect === p || text.includes(p)
        );
        const byLocation = loc && tl === loc;
        return byPerson || byLocation;
      };

      return {
        notes: notes.filter(matchNote),
        tips: tips.filter(matchTip),
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
