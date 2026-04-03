import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

enum UserRole {
  Owner,
  Client,
  Delivery,
}

registerEnumType(UserRole, {name: "UserRole"});

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity {
  private readonly PASSWORD_SALT = 10;

  @Column()
  @Field(type => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field(type => String)
  password: string;

  @Column({type: "enum", enum: UserRole})
  @Field(type => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({nullable: true, default: 0})
  @Field(type => Number)
  password_confirmation: number;

  @Column({ default: false })
  @Field(type => Boolean)
  verified: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if(this.password) {
      try {
        this.password = await bcrypt.hash(this.password, this.PASSWORD_SALT);
      } catch(e) {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch(e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }
}