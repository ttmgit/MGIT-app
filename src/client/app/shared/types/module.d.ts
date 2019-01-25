import { Menu } from "./menu";

export class Module {
    public id: number;
    public name: string;
    public moduleIcon: string;
    public isActive: boolean;
    public isDeleted: boolean;
    public created: Date;
    public updated: Date;
    public menus: Array<Menu>;
}