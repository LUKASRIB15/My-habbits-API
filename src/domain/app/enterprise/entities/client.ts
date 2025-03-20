import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export type ClientProps = {
  name: string
  email: string
  password: string
}

export class Client extends Entity<ClientProps>{
  get name(){
    return this.props.name
  }

  set name(value: string){
    this.props.name = value
  }
  
  get email(){
    return this.props.email
  }

  set email(value: string){
    this.props.email = value
  }

  get password(){
    return this.props.password
  }

  set password(value: string){
    this.props.password = value
  }

  static create(props: ClientProps, id?: UniqueEntityID){
    return new Client({
      ...props
    }, id)
  }
}