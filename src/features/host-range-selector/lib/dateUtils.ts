import {
  addDays,
  endOfMonth,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfToday,
} from 'date-fns';

/**
 * Checks if a date is disabled (before today).
 */
export const isDateDisabled = (date: Date): boolean => {
  const today = startOfToday();
  return isBefore(date, today);
};

/**
 * Returns the minimum and maximum allowed dates for navigation.
 * Range: Current month ~ Next Year Feb.
 */
export const getNavigationLimits = () => {
  const today = startOfToday();
  const currentYear = today.getFullYear();

  const minDate = startOfMonth(today);
  const nextYearFeb = new Date(currentYear + 1, 1, 1);
  const maxDate = endOfMonth(nextYearFeb);

  return { minDate, maxDate };
};

/**
 * Generates an array of dates between start and end (inclusive).
 */
export const generateDateRange = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  let current = new Date(start);
  const loopEnd = new Date(end);

  // Normalize times to start of day to avoid infinite loops if time differs
  current.setHours(0, 0, 0, 0);
  loopEnd.setHours(0, 0, 0, 0);

  if (current > loopEnd) {
    // Swipe handling (End before Start)
    // Just swap or handle gracefully. Let's swap.
    const temp = new Date(current);
    current = new Date(loopEnd);
    loopEnd.setTime(temp.getTime());
  }

  while (current <= loopEnd) {
    dates.push(new Date(current));
    current = addDays(current, 1);
  }
  return dates;
};

/**
 * Smart Toggle Logic.
 * - Determines "Action Mode" based on the state of the *First Date* in the new range.
 * - If First Date is SELECTED -> REMOVE all dates in new range from current selection.
 * - If First Date is UNSELECTED -> ADD all dates in new range to current selection.
 */
export const toggleDatesSmart = (
  currentSelection: Date[],
  newRange: Date[],
): Date[] => {
  if (newRange.length === 0) return currentSelection;

  const firstDate = newRange[0];
  const isFirstSelected = currentSelection.some((d) => isSameDay(d, firstDate));

  let nextSelection = [...currentSelection];

  if (isFirstSelected) {
    // Mode: REMOVE
    // Remove any date in newRange from nextSelection
    nextSelection = nextSelection.filter(
      (existing) => !newRange.some((nr) => isSameDay(nr, existing)),
    );
  } else {
    // Mode: ADD
    // Add all dates in newRange to nextSelection (avoid duplicates)
    newRange.forEach((nr) => {
      if (!nextSelection.some((existing) => isSameDay(existing, nr))) {
        nextSelection.push(nr);
      }
    });
  }

  return nextSelection.sort((a, b) => a.getTime() - b.getTime());
};
