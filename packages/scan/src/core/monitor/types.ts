import { Fiber } from 'react-reconciler';

export enum Device {
  DESKTOP = 0,
  TABLET = 1,
  MOBILE = 2,
}

export interface Session {
  id: string;
  url: string; // flush everytime route changes for accuracy
  device: Device;
  agent: string;
  wifi: string;
  cpu: number;
  gpu: string | null;
  mem: number;
}

export interface IngestRequest {
  route: string | null;
  path: string;
  interactions: Array<
    Omit<ScanInteraction, 'components' | 'performanceEntry'> & {
      // this is so bad, but for the sake of time
      id: string;
      latency: number;
      type: 'pointer' | 'keyboard' | null;
      startTime: number;
      processingStart: number;
      processingEnd: number;
      duration: number;
      inputDelay: number;
      processingDuration: number;
      presentationDelay: number;
    }
  >;
  components: Array<{
    // todo: fix types
    interactionId: string; // grouping components by interaction
    name: string;
    renders: number; // how many times it re-rendered / instances (normalized)
    instances: number; // instances which will be used to get number of total renders by * by renders
    totalTime?: number;
    selfTime?: number;
  }>;
  session: Session;
}
export interface ScanInteraction {
  componentName: string;
  componentPath: string;
  performanceEntry: PerformanceInteraction;
  components: Map<
    string,
    Component & {
      fibers: Set<Fiber>; // no references will exist to this once array is cleared after flush, so we don't have to worry about memory leaks
      retiresAllowed: number; // if our server is down and we can't collect fibers/ user has no network, it will memory leak. We need to only allow a set amount of retries before it gets gcd
    }
  >;
}

// export interface Interaction {
//   // id: string; // a hashed unique id for interaction (groupable across sessions)
//   // name: string; // name of Component
//   // type: string; // type of interaction i.e pointer
//   // time: number; // time of interaction in ms
//   componentName: string
//   componentPath: string, // the unique identifier for the interaction on the website
//   entry: In

//   // timestamp: number;
//   // //... anything you might need here
// }
export interface PerformanceInteractionEntry extends PerformanceEntry {
  interactionId: string;
  target: Element;
  name: string;
  duration: number;
  startTime: number;
  processingStart: number;
  processingEnd: number;
  entryType: string;
}
export interface PerformanceInteraction {
  id: string;
  latency: number;
  entries: PerformanceInteractionEntry[]; // gonna remove this
  target: Element;
  type: 'pointer' | 'keyboard' | null;
  startTime: number;
  processingStart: number;
  processingEnd: number;
  duration: number;
  inputDelay: number;
  processingDuration: number;
  presentationDelay: number;
}

export interface Component {
  // interactionId: string; // grouping components by interaction
  name: string;
  renders: number; // how many times it re-rendered / instances (normalized)
  // instances: number; // instances which will be used to get number of total renders by * by renders
  totalTime?: number;
  selfTime?: number;
}
