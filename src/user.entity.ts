export class User {
  constructor(
    public id: string,
    public name: string,
    public userClass: string,
    public eventsSell: string[],
    public eventsBuy: string[]
  ) {}
}
