/**
 * Filters checkins based on person, location, and time range
 */
export const filterCheckins = (checkins, filters) => {
  if (
    !filters.personFilter &&
    !filters.locationFilter &&
    !filters.startDate &&
    !filters.endDate
  ) {
    return checkins;
  }

  return checkins.filter((c) => {
    // Filter by person
    if (
      filters.personFilter &&
      !c.personName.toLowerCase().includes(filters.personFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by location
    if (
      filters.locationFilter &&
      !c.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      if (!c.timestamp) return false;

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (c.timestamp < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (c.timestamp > endDate) return false;
      }
    }

    return true;
  });
};

/**
 * Filters messages based on person (sender/receiver), location, and time range
 */
export const filterMessages = (messages, filters) => {
  if (
    !filters.personFilter &&
    !filters.locationFilter &&
    !filters.startDate &&
    !filters.endDate
  ) {
    return messages;
  }

  return messages.filter((m) => {
    // Filter by person (either sender or receiver)
    if (filters.personFilter) {
      const personLower = filters.personFilter.toLowerCase();
      const matchesFrom = m.from.toLowerCase().includes(personLower);
      const matchesTo = m.to.toLowerCase().includes(personLower);
      if (!matchesFrom && !matchesTo) return false;
    }

    // Filter by location
    if (
      filters.locationFilter &&
      m.location &&
      !m.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      if (!m.timestamp) return false;

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (m.timestamp < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (m.timestamp > endDate) return false;
      }
    }

    return true;
  });
};

/**
 * Filters sightings based on person involved, location, and time range
 */
export const filterSightings = (sightings, filters) => {
  if (
    !filters.personFilter &&
    !filters.locationFilter &&
    !filters.startDate &&
    !filters.endDate
  ) {
    return sightings;
  }

  return sightings.filter((s) => {
    // Filter by person (either personName or seenWith)
    if (filters.personFilter) {
      const personLower = filters.personFilter.toLowerCase();
      const matchesPerson = s.personName.toLowerCase().includes(personLower);
      const matchesSeen = s.seenWith.toLowerCase().includes(personLower);
      if (!matchesPerson && !matchesSeen) return false;
    }

    // Filter by location
    if (
      filters.locationFilter &&
      !s.location.toLowerCase().includes(filters.locationFilter.toLowerCase())
    ) {
      return false;
    }

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      if (!s.timestamp) return false;

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        startDate.setHours(0, 0, 0, 0);
        if (s.timestamp < startDate) return false;
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (s.timestamp > endDate) return false;
      }
    }

    return true;
  });
};
