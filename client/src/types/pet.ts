export interface Pet {
  id: number;
  name: string;
  species: string;
  age?: string;
  favoriteFood?: string;
  story: string;
  photo?: string;
  dateOfPassing?: string;
  moonType: "full" | "crescent" | "gibbous";
  position: {
    x: number; // percentage
    y: number; // percentage
  };
  size: "small" | "medium" | "large";
}
