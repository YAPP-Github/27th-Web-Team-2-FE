import ArrowDown from './ArrowDown';
import ArrowNext from './ArrowNext';
import ArrowPrev from './ArrowPrev';
import ArrowUp from './ArrowUp';
import IcCalendarAdd from './IcCalendarAdd';
import IcCheckboxChecked from './IcCheckboxChecked';
import IcCheckboxDefault from './IcCheckboxDefault';
import IcCircleCheckFilled from './IcCircleCheckFilled';
import IcCircleCheckOutline from './IcCircleCheckOutline';
import IcCircleXFilled from './IcCircleXFilled';
import IcCircleXOutline from './IcCircleXOutline';
import IcFlame from './IcFlame';
import IcHamburger from './IcHamburger';
import IcInfoFilled from './IcInfoFilled';
import IcInfoOutline from './IcInfoOutline';
import IcMagic from './IcMagic';
import IcMenuClose from './IcMenuClose';
import IcOtherShare from './IcOtherShare';
import IcPeople from './IcPeople';
import IcRefresh from './IcRefresh';

export const icons = {
  arrow_down: ArrowDown,
  arrow_next: ArrowNext,
  arrow_prev: ArrowPrev,
  arrow_up: ArrowUp,
  ic_calendar_add: IcCalendarAdd,

  ic_checkbox_checked: IcCheckboxChecked,
  ic_checkbox_default: IcCheckboxDefault,
  ic_circle_check_filled: IcCircleCheckFilled,
  ic_circle_check_outline: IcCircleCheckOutline,
  ic_circle_x_filled: IcCircleXFilled,
  ic_circle_x_outline: IcCircleXOutline,
  ic_flame: IcFlame,
  ic_hamburger: IcHamburger,
  ic_info_filled: IcInfoFilled,
  ic_info_outline: IcInfoOutline,
  ic_magic: IcMagic,
  ic_menu_close: IcMenuClose,
  ic_other_share: IcOtherShare,
  ic_people: IcPeople,
  ic_refresh: IcRefresh,
} as const;

export type IconName = keyof typeof icons;
