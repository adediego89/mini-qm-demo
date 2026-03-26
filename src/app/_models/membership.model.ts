

export enum MembershipTypes {
  DIVISION = "DIVISION",
  QUEUE = "QUEUE",
  GROUP = "GROUP",
  USER = "USER"
}

export enum PermissionTypes {
  READ_ONLY = "READ_ONLY",
  CONTRIBUTOR = "CONTRIBUTOR",
  FULL_ACCESS = "FULL_ACCESS",
}

export class Membership {
  id: number | undefined;
  objectId: string = '';
  type: MembershipTypes = MembershipTypes.USER;
  access: PermissionTypes = PermissionTypes.READ_ONLY;

  static FromDto(dto: any): Membership {
    const result = new Membership();
    result.id = dto.id;
    result.objectId = dto.objectId;
    result.type = dto.type;
    result.access = dto.access;
    return result;
  }

  toDto(): any {
    return {
      id: this.id,
      objectId: this.objectId,
      type: this.type,
      access: this.access,
    }
  }

  clone(): Membership {
    const result = new Membership();
    result.id = this.id;
    result.objectId = this.objectId;
    result.type = this.type;
    result.access = this.access;
    return result;
  }

}
