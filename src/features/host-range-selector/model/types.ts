export type HostRangeValue = {
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
};

export type HostRangeProps = {
  today: string; // YYYY-MM-DD
  initial?: HostRangeValue;
  onChange: (value: HostRangeValue) => void;
};
