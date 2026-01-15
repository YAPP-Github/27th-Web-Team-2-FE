export interface HostRangeSelectorProps {
  /**
   * Currently selected dates.
   * Can be disjoint (e.g., [Dec 1, Dec 5, Dec 10]).
   */
  selectedDates: Date[];

  /**
   * Callback when selection changes.
   */
  onChange: (dates: Date[]) => void;
}
