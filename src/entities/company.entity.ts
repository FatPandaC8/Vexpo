import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('company')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    email: string;

    @Column({nullable: true})
    phone: number;

    @Column({nullable: true})
    website: string;

    @Column()
    description: string;
}