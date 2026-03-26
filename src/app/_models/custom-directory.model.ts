import { CustomDirectoryDto } from '../_dtos';

export class CustomDirectory {
  id: string;
  name?: string;

  constructor(dto: { [key: string]: any; }) {
    this.id = dto['key'];
    this.name= dto['name'];
  }
}
