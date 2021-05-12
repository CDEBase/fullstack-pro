import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column('text', { nullable: true })
    name?: string;

    @Column('text', { nullable: true })
    surname?: string;
}
