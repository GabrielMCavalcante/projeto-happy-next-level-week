import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity("password_recovery_tokens")
export default class PasswordRecoveryTokens {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  token: string;
}