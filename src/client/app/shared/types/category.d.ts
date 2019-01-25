import { Product } from "./product";

export class Category {
    public id: number;
    public name: string;
    public description: string;
    public isActive: boolean;
    public isDeleted: boolean;
    public created: Date;
    public updated: Date;
    public products: Array<Product>;
}
