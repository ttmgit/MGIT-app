import { Product } from "./product";
import { Order } from "./order";

export class OrderRequest {
    public order: Order;
    public products: Product[];
}
