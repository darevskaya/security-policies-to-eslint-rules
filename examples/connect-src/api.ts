import { endpoints } from "./endpoints.ts";

export function getOrders() {
  return fetch(`${endpoints.api}/orders`);
}
