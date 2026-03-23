export interface HostRangeSelectorProps {
  /**
   * Currently selected dates.
   * Can be disjoint (e.g., [Dec 1, Dec 5, Dec 10]).
   */
  selectedDates: Date[];

  /**
   * Callback when selection changes.
   * Accepts either a new Date[] directly, or an updater function
   * that receives the previous selection and returns the new one.
   */
  onChange: (dates: Date[] | ((prev: Date[]) => Date[])) => void;

  /**
   * Optional. If provided, only these dates will be enabled.
   * Dates not in this list will be disabled (grayed out & unclickable).
   */
  availableDates?: Date[];
}
