import { MaybeString, OntimeEvent, TimerType } from 'ontime-types';

import type { ViewExtendedTimer } from '../../../common/models/TimeManager.type';

type TimerTypeParams = Pick<ViewExtendedTimer, 'timerType' | 'current' | 'elapsed' | 'clock'>;

export function getTimerByType(timerObject?: TimerTypeParams): number | null {
  if (!timerObject) {
    return null;
  }

  switch (timerObject.timerType) {
    case TimerType.CountDown:
    case TimerType.TimeToEnd:
      return timerObject.current;
    case TimerType.CountUp:
      return Math.abs(timerObject.elapsed ?? 0);
    case TimerType.Clock:
      return timerObject.clock;
    default: {
      const exhaustiveCheck: never = timerObject.timerType;
      return exhaustiveCheck;
    }
  }
}

export function isStringBoolean(text: string | null) {
  if (text === null) {
    return false;
  }
  return text?.toLowerCase() === 'true' || text === '1';
}

/**
 * Retrieves a dynamic property from an event
 * Considers custom fields
 */
export function getPropertyValue(event: OntimeEvent | null, property: MaybeString): string | undefined {
  if (!event) {
    return undefined;
  }
  if (typeof property !== 'string') {
    return undefined;
  }

  if (property.startsWith('custom-')) {
    const field = property.split('custom-')[1];
    return event.custom?.[field]?.value;
  }

  return event[property as keyof OntimeEvent] as string;
}
