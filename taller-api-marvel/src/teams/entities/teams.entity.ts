import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'teams' })
export class TeamEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'varchar', nullable: true })
    base: string | null;

    @Column({ name: 'founded_year', type: 'int', nullable: true })
    founded_year: number | null;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
