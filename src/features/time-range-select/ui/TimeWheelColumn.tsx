'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const ITEM_HEIGHT = 56; // px per item
const CONTAINER_HEIGHT = ITEM_HEIGHT * 5; // 280px — 5 items visible
const PAD_SIZE = ITEM_HEIGHT * 2; // top/bottom padding for first/last item centering

interface TimeWheelColumnProps {
  items: number[];
  value: number;
  onChange: (value: number) => void;
  formatItem?: (n: number) => string;
}

export default function TimeWheelColumn({
  items,
  value,
  onChange,
  formatItem = String,
}: TimeWheelColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIndex = items.indexOf(value);

  // scrollPos as float for real-time fade: initialized to selectedIndex
  const [scrollPos, setScrollPos] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  );

  // initial scroll on mount — DOM only, no setState
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || selectedIndex < 0) return;
    el.scrollTop = selectedIndex * ITEM_HEIGHT;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // sync when value changes externally
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || selectedIndex < 0) return;
    const current = Math.round(el.scrollTop / ITEM_HEIGHT);
    if (current !== selectedIndex) {
      el.scrollTo({ top: selectedIndex * ITEM_HEIGHT, behavior: 'smooth' });
    }
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setScrollPos(el.scrollTop / ITEM_HEIGHT);

    if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = setTimeout(() => {
      const snapped = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(snapped, items.length - 1));
      onChange(items[clamped]);
    }, 150);
  }, [items, onChange]);

  useEffect(() => {
    return () => {
      if (scrollEndTimer.current) clearTimeout(scrollEndTimer.current);
    };
  }, []);

  const getItemStyle = (index: number): CSSProperties => {
    const dist = Math.abs(index - scrollPos);
    if (dist < 0.7) return { color: '#111827', fontWeight: 700 };
    if (dist < 1.5) return { color: '#9CA3AF', fontWeight: 400 };
    return { color: '#D1D5DB', fontWeight: 400 };
  };

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className='overflow-y-scroll [&::-webkit-scrollbar]:hidden'
      style={{
        height: CONTAINER_HEIGHT,
        scrollSnapType: 'y mandatory',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ height: PAD_SIZE }} aria-hidden='true' />
      {items.map((item, index) => (
        <div
          key={item}
          style={{
            height: ITEM_HEIGHT,
            scrollSnapAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'color 80ms ease',
            minHeight: 44,
            ...getItemStyle(index),
          }}
          onClick={() => {
            scrollRef.current?.scrollTo({
              top: index * ITEM_HEIGHT,
              behavior: 'smooth',
            });
            onChange(item);
          }}
        >
          {formatItem(item)}
        </div>
      ))}
      <div style={{ height: PAD_SIZE }} aria-hidden='true' />
    </div>
  );
}
