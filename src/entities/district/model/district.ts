import data from "./district-coordinates.json";

export type District = {
  lat: number;
  lon: number;
  name: string;
};

export const districts = data satisfies District[];
