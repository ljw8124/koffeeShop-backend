import { BeforeInsert, Column, Entity } from 'typeorm';
import { CoreEntity } from '../../common/entities/core.entity';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';

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
  email: string;

  @Column()
  @Field(type => String)
  password: string;

  @Column({type: "enum", enum: UserRole})
  @Field(type => UserRole)
  role: UserRole;

  @Column({nullable: true, default: 0})
  @Field(type => Number)
  password_confirmation: number;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password, this.PASSWORD_SALT);
    } catch(e) {
      console.error(e);
      throw new InternalServerErrorException();
    }

  }
}