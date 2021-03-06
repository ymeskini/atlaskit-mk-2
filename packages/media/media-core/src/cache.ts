import { EventEmitter2 } from 'eventemitter2';
import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';

export interface StateDeferredValue<T> {
  promise: Promise<T>;
  resolve: Function;
  value?: T;
}

export interface CachedMediaState<T> {
  streams: LRUCache<string, Observable<T>>;
  stateDeferreds: Map<string, StateDeferredValue<T>>;
  eventEmitter?: EventEmitter2;
}

export const mediaState: CachedMediaState<Object> = {
  streams: new LRUCache<string, Observable<Object>>(1000),
  stateDeferreds: new Map<string, StateDeferredValue<Object>>(),
  eventEmitter: new EventEmitter2(),
};
