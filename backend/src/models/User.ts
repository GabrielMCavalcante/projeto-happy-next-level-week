import { Entity, Column, PrimaryColumn } from "typeorm"

@Entity("users")
export default class User {
    @PrimaryColumn()
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    password_recovery_token: string;
}