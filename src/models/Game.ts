export interface Game {
  id: string;
  game: string;
  gameVersion: string;
  category: string;
  imageLink: string;
  primaryValue: string;
  secondaryValue: string;
  originalPrice?: string;
  console?: string;
  status?: string;
  unmissable?: boolean;
  inPromo?: boolean;
  description?: string;
}
