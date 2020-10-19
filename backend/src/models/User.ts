import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import PasswordRecoveryTokens from "./PasswordRecoveryTokens"

@Entity("users")
export default class User {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @OneToOne(() => PasswordRecoveryTokens)
    @JoinColumn()
    password_recovery_token: PasswordRecoveryTokens;
}