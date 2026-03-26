
export interface CustomDirectoryDto {
  key: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  ownerId?: string;
  name?: string;
  description?: string;
  interactions?: any[];
}
