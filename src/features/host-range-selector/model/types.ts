export interface HostRangeSelectorProps {
  /**
   * Currently selected dates.
   * Can be disjoint (e.g., [Dec 1, Dec 5, Dec 10]).
   */
  selectedDates: Date[];

  /**
   * Callback when selection changes.
   * Receives an updater function that takes the previous selection
   * and returns the new one — same semantics as React setState updater.
   */
  onChange: (updater: (prev: Date[]) => Date[]) => void;

  /**
   * Optional. If provided, only these dates will be enabled.
   * Dates not in this list will be disabled (grayed out & unclickable).
   */
  availableDates?: Date[];
}
