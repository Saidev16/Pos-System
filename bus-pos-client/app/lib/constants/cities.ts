export const MOROCCAN_CITIES: string[] = [
  "Agadir",
  "Casablanca",
  "Fes",
  "Marrakech",
  "Meknes",
  "Oujda",
  "Rabat",
  "Tangier",
  "Tetouan",
  "El Jadida",
  "Kenitra",
  "Nador",
  "Safi",
  "Sale",
  "Taza",
] as const;

export type MoroccanCity = (typeof MOROCCAN_CITIES)[number];
