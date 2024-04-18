type DataRefs = {
  eventName: string;
  callback: (param: any) => void;
};

export type Refs = {[key: string]: DataRefs};

export type EmitterListener = {
  count: number;
  refs: Refs;
};
