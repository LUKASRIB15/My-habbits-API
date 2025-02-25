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
  
  get email(){
    return this.props.email
  }

  get password(){
    return this.props.password
  }

  static create(props: ClientProps, id?: UniqueEntityID){
    return new Client({
      ...props
    }, id)
  }
}