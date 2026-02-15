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

  /**
   * Optional. If provided, only these dates will be enabled.
   * Dates not in this list will be disabled (grayed out & unclickable).
   */
  availableDates?: Date[];
}
