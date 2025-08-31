import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';

// Static encryption transformer that uses the correct key
// This will use the fallback key which is exactly 32 characters
const staticKeyString = '12345678901234567890123456789012'; // 32 chars for AES-256 - verified correct length
const staticKey = Buffer.from(staticKeyString, 'utf8'); // Convert to Buffer
console.log('🔐 Key being used for encryption transformer:', staticKeyString, 'Length:', staticKeyString.length);
console.log('🔐 Buffer key length:', staticKey.length, 'bytes');

const encryptionTransformer = new EncryptionTransformer({
  key: staticKey as any, // Use Buffer instead of string - bypass type check
  algorithm: 'aes-256-cbc',
  ivLength: 16,
});

console.log('🔐 Static encryption transformer created with Buffer key');

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  age: number;

  // Encrypted field for sensitive data
  @Column({
    type: 'text',
    nullable: true,
    transformer: encryptionTransformer
  })
  phoneNumber?: string;

  // Another encrypted field
  @Column({
    type: 'text',
    nullable: true,
    transformer: encryptionTransformer
  })
  socialSecurityNumber?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}