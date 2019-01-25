export class ProductDocument {
    sku: string;
    short_description: string;
    case?: number;
    items_by_case: number;
    origin?: string;
    account?: string;
    type_shipment?: string;
    sap_code?: number;
}
