/**
 * JotForm submissions arrive as:
 *   { id, created_at, answers: { "2": { name, answer }, ... } }
 *
 * These helpers pull out the fields we care about and return clean objects.
 */

/** Flatten a single submission's answers into `{ [name]: answer }`. */
const flattenAnswers = (submission) => {
  const out = {};
  const answers = submission?.answers ?? {};
  Object.values(answers).forEach((entry) => {
    if (entry?.name && 'answer' in entry) {
      out[entry.name] = entry.answer;
    }
  });
  return out;
};

/** Parse "DD-MM-YYYY HH:mm" into a Date (falls back to native Date parse). */
export const parseTimestamp = (value) => {
  if (!value) return null;
  const match = String(value).match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{1,2}):(\d{2})$/
  );
  if (match) {
    const [, dd, mm, yyyy, hh, min] = match;
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min)
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

/** Parse "lat,lng" strings into { lat, lng } or null. */
export const parseCoordinates = (value) => {
  if (!value) return null;
  const [latRaw, lngRaw] = String(value).split(',').map((s) => s.trim());
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

/** Normalize a check-in submission. */
export const normalizeCheckin = (submission) => {
  const fields = flattenAnswers(submission);
  return {
    id: submission.id,
    personName: fields.personName ?? 'Unknown',
    timestamp: parseTimestamp(fields.timestamp),
    timestampRaw: fields.timestamp ?? null,
    location: fields.location ?? 'Unknown',
    coordinates: parseCoordinates(fields.coordinates),
    note: fields.note ?? '',
  };
};

/** Normalize a messages submission. */
export const normalizeMessage = (submission) => {
  const fields = flattenAnswers(submission);
  return {
    id: submission.id,
    from: fields.senderName ?? fields.from ?? fields.sender ?? 'Unknown',
    to: fields.recipientName ?? fields.to ?? fields.receiver ?? 'Unknown',
    timestamp: parseTimestamp(fields.timestamp),
    timestampRaw: fields.timestamp ?? null,
    text: fields.text ?? fields.message ?? fields.content ?? '',
    location: fields.location ?? null,
    coordinates: parseCoordinates(fields.coordinates),
    urgency: fields.urgency ?? 'low',
  };
};

/** Normalize a sighting submission. */
export const normalizeSighting = (submission) => {
  const fields = flattenAnswers(submission);
  return {
    id: submission.id,
    personName: fields.personName ?? fields.personA ?? fields.person1 ?? 'Unknown',
    seenWith: fields.seenWith ?? fields.personB ?? fields.person2 ?? 'Unknown',
    location: fields.location ?? 'Unknown',
    coordinates: parseCoordinates(fields.coordinates),
    timestamp: parseTimestamp(fields.timestamp),
    timestampRaw: fields.timestamp ?? null,
    note: fields.note ?? '',
  };
};

/** Normalize a personal note submission. */
export const normalizePersonalNote = (submission) => {
  const fields = flattenAnswers(submission);
  return {
    id: submission.id,
    author: fields.author ?? fields.personName ?? 'Unknown',
    about: fields.about ?? fields.subject ?? '',
    timestamp: parseTimestamp(fields.timestamp),
    timestampRaw: fields.timestamp ?? null,
    note: fields.note ?? fields.content ?? '',
  };
};

/** Normalize an anonymous tip submission. */
export const normalizeTip = (submission) => {
  const fields = flattenAnswers(submission);
  const reliabilityRaw =
    fields.reliability ?? fields.confidence ?? fields.rating ?? null;
  const reliability =
    reliabilityRaw !== null && reliabilityRaw !== ''
      ? Number(reliabilityRaw)
      : null;
  return {
    id: submission.id,
    timestamp: parseTimestamp(fields.timestamp),
    timestampRaw: fields.timestamp ?? null,
    tip: fields.tip ?? fields.content ?? fields.note ?? '',
    reliability: Number.isFinite(reliability) ? reliability : null,
  };
};

/** Apply a normalizer to an API response's `content` array. */
export const normalizeResponse = (apiResponse, normalizer) => {
  const content = apiResponse?.content;
  if (!Array.isArray(content)) return [];
  return content.map(normalizer);
};
