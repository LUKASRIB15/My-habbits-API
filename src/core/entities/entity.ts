import { UniqueEntityID } from "./unique-entity-id";

export class Entity<Props>{
  private _id: UniqueEntityID;
  protected props: Props

  get id(){
    return this._id
  }

  constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID();
  }

  public equals(entity: Entity<Props>){
    if(entity === this && entity.id === this.id){
      return true
    }

    return false
  }
}