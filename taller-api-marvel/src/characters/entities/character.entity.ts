import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { TeamEntity } from "../../teams/entities/teams.entity.js";

export enum CharacterStatus {
    ACTIVE = 'ACTIVE',
    INJURED = 'INJURED',
    MISSING = 'MISSING',
    RETIRED = 'RETIRED',
}

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

    @Column({ type: 'varchar', default: CharacterStatus.ACTIVE })
    status: CharacterStatus;

    @Column({ name: 'is_villain', default: false })
    is_villain: boolean;

    @Column({ name: 'team_id', type: 'int', nullable: true })
    team_id: number | null;

    @ManyToOne(() => TeamEntity, { nullable: true })
    @JoinColumn({ name: 'team_id' })
    team: TeamEntity | null;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
}