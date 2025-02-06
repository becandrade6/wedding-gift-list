export type Gift = {
  id: string;
  name: string;
  link: string;
  price: number;
  purchased: boolean;
  store: string;
};

export type Purchase = {
  id: string;
  gift_id: string;
  buyer_name: string;
  buyer_surname: string;
  home_delivery: boolean;
  estimated_delivery_date?: Date;
};