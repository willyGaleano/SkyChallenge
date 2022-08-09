import { Company } from './company.entity';

export class User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: any;
    phone: string;
    website: string;
    company: Company;
}
