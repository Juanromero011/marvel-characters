import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'characters' })
export class CharacterEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'real_name' })
    real_name: string;

    @Column({ unique: true })
    alias: string;

    @Column({ name: 'main_power' })
    main_power: string;

    @Column({ name: 'power_level' })
    power_level: number;

    @Column({ default: 'ACTIVE' })
    status: string;

    @Column({ name: 'is_villain', default: false })
    is_villain: boolean;

    @Column({ name: 'team_id', nullable: true })
    team_id: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}
