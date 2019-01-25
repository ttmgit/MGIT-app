export class Product {
    public id?: number;
    public sku?: string;
    public shortDescription?: string;
    public largeDescription?: string;
    public itemsByCase?: number;
    public isSerial?: boolean;
    public isLot?: boolean;
    public isKit?: boolean;
    public requiereInspection?: boolean;
    public isActive?: boolean;
    public lotDaysInterval?: number;
    public sendInterface?: boolean;
    public checkNumber?: string;
    public created?: Date;
    public updated?: Date;
    public _pivot_quantity?: number; // Added due to withPivot relationship with order_has_product
    public product_brand?: string;
    public productHandling?: string;
    public supplier?: string;
    public weight?: string;
    public quantity?: number;
    public total?: number;
    public product_id?: number;
}
