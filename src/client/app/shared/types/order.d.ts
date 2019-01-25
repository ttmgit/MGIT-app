import { Product } from "./product";
import { Account } from "./account";

export class Order {
    public id?: number;
    public name?: string;
    public requestPerson?: string;
    public orderDate?: Date;
    public optimalDeliveryDate?: Date;
    public created?: string;
    public updated?: string;
    public product?: Array<Product>;
    public account?: Array<Account>;
}
