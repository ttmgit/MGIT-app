import { Order } from "./order";
import { Category } from "./category";

export class Account {
    public id: number;
    public name: string;
    public address: string;
    public phone1: string;
    public phone2: string;
    public contact: string;
    public email: string;
    public categoryId: number;
    public rfc: string;
    public prefix: string;
    public sapCode: string;
    public isActive: boolean;
    public isBlocked: boolean;
    public isDeleted: boolean;
    public created: Date;
    public updated: Date;
    public accountCode: string;
    public zipcode: string;
    public neighborhood: string;
    public district: string;
    public state: string;
    public finnancial_start_date: Date;
    public orders: Array<Order>;
    public category: Category;
}
