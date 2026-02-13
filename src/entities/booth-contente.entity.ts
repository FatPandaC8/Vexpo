import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('booth')
export class Booth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: number;

  @Column()
  boothId: number;

  @Column()
  content: {
    // string array of links to their website, consider making a built in html/embeded videos box
    logo?: string;
    bannerImage?: string;
    videos?: string[];
    documents?: string[];
  };
}
