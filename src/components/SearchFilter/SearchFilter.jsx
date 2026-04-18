import { useState } from "react";
import styles from "./SearchFilter.module.css";

const SearchFilter = ({
  onFilterChange,
  people = [],
  locations = [],
  showPeople = true,
  showTime = true,
  showLocation = true,
}) => {
  const [personFilter, setPersonFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showPersonSuggestions, setShowPersonSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const handlePersonChange = (e) => {
    const value = e.target.value;
    setPersonFilter(value);
    setShowPersonSuggestions(!!value);
    notifyChange({ personFilter: value, locationFilter, startDate, endDate });
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocationFilter(value);
    setShowLocationSuggestions(!!value);
    notifyChange({ personFilter, locationFilter: value, startDate, endDate });
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    notifyChange({ personFilter, locationFilter, startDate: value, endDate });
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    notifyChange({ personFilter, locationFilter, startDate, endDate: value });
  };

  const notifyChange = (filters) => {
    onFilterChange(filters);
  };

  const handleReset = () => {
    setPersonFilter("");
    setLocationFilter("");
    setStartDate("");
    setEndDate("");
    setShowPersonSuggestions(false);
    setShowLocationSuggestions(false);
    onFilterChange({
      personFilter: "",
      locationFilter: "",
      startDate: "",
      endDate: "",
    });
  };

  const hasActiveFilters =
    personFilter || locationFilter || startDate || endDate;

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        {showPeople && (
          <div className={styles.filterGroup}>
            <label htmlFor="person-filter" className={styles.label}>
              Person
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="person-filter"
                type="text"
                placeholder="Search by name..."
                value={personFilter}
                onChange={handlePersonChange}
                onBlur={() =>
                  setTimeout(() => setShowPersonSuggestions(false), 150)
                }
                onFocus={() => personFilter && setShowPersonSuggestions(true)}
                className={styles.input}
              />
              {people.length > 0 && personFilter && showPersonSuggestions && (
                <div className={styles.suggestions}>
                  {people
                    .filter((p) =>
                      p.toLowerCase().includes(personFilter.toLowerCase()),
                    )
                    .slice(0, 5)
                    .map((person) => (
                      <button
                        key={person}
                        type="button"
                        className={styles.suggestion}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setPersonFilter(person);
                          setShowPersonSuggestions(false);
                          notifyChange({
                            personFilter: person,
                            locationFilter,
                            startDate,
                            endDate,
                          });
                        }}
                      >
                        {person}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {showLocation && (
          <div className={styles.filterGroup}>
            <label htmlFor="location-filter" className={styles.label}>
              Location
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="location-filter"
                type="text"
                placeholder="Search by address..."
                value={locationFilter}
                onChange={handleLocationChange}
                onBlur={() =>
                  setTimeout(() => setShowLocationSuggestions(false), 150)
                }
                onFocus={() =>
                  locationFilter && setShowLocationSuggestions(true)
                }
                className={styles.input}
              />
              {locations.length > 0 &&
                locationFilter &&
                showLocationSuggestions && (
                  <div className={styles.suggestions}>
                    {locations
                      .filter((l) =>
                        l.toLowerCase().includes(locationFilter.toLowerCase()),
                      )
                      .slice(0, 5)
                      .map((location) => (
                        <button
                          key={location}
                          type="button"
                          className={styles.suggestion}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setLocationFilter(location);
                            setShowLocationSuggestions(false);
                            notifyChange({
                              personFilter,
                              locationFilter: location,
                              startDate,
                              endDate,
                            });
                          }}
                        >
                          {location}
                        </button>
                      ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {showTime && (
          <>
            <div className={styles.filterGroup}>
              <label htmlFor="start-date" className={styles.label}>
                From
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className={styles.input}
              />
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="end-date" className={styles.label}>
                To
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className={styles.input}
              />
            </div>
          </>
        )}
      </div>

      {hasActiveFilters && (
        <button className={styles.resetBtn} onClick={handleReset}>
          Clear filters
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
