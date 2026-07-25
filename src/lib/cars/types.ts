export type CarSpec = {
  label: string;
  value: string;
};

export type CarClass = "CHALLENGER" | "CRUISER" | "PROTOTYPE";

export type CarStatus = "ACTIVE" | "RETIRED";

export type CarEntry = {
  id: string;
  title: string;
  image: string;
  content: string;
  specs: CarSpec[];
  note?: string;
  status: CarStatus;
  retired?: string;
  serviceYears: string;
  carClass: CarClass;
};

export type FleetTimelineEntry = {
  name: string;
  years: string;
  scrollTargetId: string;
};
