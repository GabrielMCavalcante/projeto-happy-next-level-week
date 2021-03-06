import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import Orphanage from './Orphanage'

@Entity("orphanages_images")
export default class Image {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => Orphanage, orphanage => orphanage.images, { onDelete: "CASCADE" })
    @JoinColumn({ name: "orphanage_id" })
    orphanage: Orphanage
}