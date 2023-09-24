import { nanoid } from "nanoid";

export default class TodoItem {
  public id!: string;
  public name: string = "";
  public completed?: boolean = false;
  public persisted: boolean = false;

  constructor() {}
}
