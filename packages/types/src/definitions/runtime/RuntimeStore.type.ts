import { Playback } from './Playback.type.js';
import { Message, TimerMessage } from './MessageControl.type.js';
import { TimerState } from './TimerState.type.js';
import { Runtime } from './Runtime.type.js';
import { OntimeEvent } from '../core/OntimeEvent.type.js';
import { SimpleTimerState } from './Extratimer.type.js';

export type RuntimeStore = {
  // timer service
  timer: TimerState;
  playback: Playback;

  // messages service
  timerMessage: TimerMessage;
  publicMessage: Message;
  lowerMessage: Message;
  externalMessage: Message;
  onAir: boolean;

  // event loader
  loaded: Runtime;
  eventNow: OntimeEvent | null;
  publicEventNow: OntimeEvent | null;
  eventNext: OntimeEvent | null;
  publicEventNext: OntimeEvent | null;

  // extra timers
  timer1: SimpleTimerState;
};
