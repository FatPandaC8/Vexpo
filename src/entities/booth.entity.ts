import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Expo } from "./expo.entity";
import { Company } from "./company.entity";

@Entity('booth')
export class Booth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expoId: number;

    @Column()
    exhibitorId: number;

    @ManyToOne(() => Expo, (expo) => expo.booths)
    expo: Expo

    @ManyToOne(() => Company, (company) => company.booths)
    company: Company;
}