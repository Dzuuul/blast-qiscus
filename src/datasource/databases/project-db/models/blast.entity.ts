import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Blast {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, default: "" })
    name: string;

    @Column({ type: 'varchar', length: 255, default: "" })
    phone: string

    @Column({ type: 'varchar', unique: true, length: 20, default: "" })
    code_voucher: string;

    @Column({ type: 'smallint', default: 0 })
    status: number;

    @Column({ type: 'int', default: 0 })
    type: number;

    @CreateDateColumn({ type: "timestamp" })
    send_date: string;

    @Column({ type: 'smallint', default: 0 })
    is_deleted: number;

    @CreateDateColumn({ type: "timestamp", default: () => 'NULL', nullable: true })
    deleted_at: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: string;
}