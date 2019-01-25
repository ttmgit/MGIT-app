export class Role {
    public id: number;
    public name: string;
    public isActive: boolean;
    public isDeleted: boolean;
    public created: Date;
    public updated: Date;
    public modules: Array<any>;
}
