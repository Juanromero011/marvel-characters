import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";
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

    @ApiProperty() @IsString() @IsNotEmpty()
    @Column({ name: 'real_name' })
    real_name: string;

    @ApiProperty() @IsString() @IsNotEmpty()
    @Column({ unique: true })
    alias: string;

    @ApiProperty() @IsString() @IsNotEmpty()
    @Column({ name: 'main_power' })
    main_power: string;

    @ApiProperty({ minimum: 1, maximum: 100 }) @IsInt() @Min(1) @Max(100)
    @Column({ name: 'power_level' })
    power_level: number;

    @ApiProperty({ enum: CharacterStatus, required: false }) @IsOptional() @IsEnum(CharacterStatus)
    @Column({ type: 'varchar', default: CharacterStatus.ACTIVE })
    status: CharacterStatus;

    @ApiProperty({ required: false }) @IsOptional() @IsBoolean()
    @Column({ name: 'is_villain', default: false })
    is_villain: boolean;

    @ApiProperty({ required: false, nullable: true }) @IsOptional() @IsInt()
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