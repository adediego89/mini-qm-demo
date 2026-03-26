export class CustomInteraction {
  key: string;
  groupId: string;
  date: string;
  notes: InteractionNote[];
  direction: string;
  dnis?: string;
  ani?: string;
  duration: number;
  type: string;
  status: string = 'pending';

  constructor(dto: { [key: string]: any; }) {
    this.key = dto['key'];
    this.groupId = dto['groupId'];
    this.date = dto['date'];
    this.notes = JSON.parse(dto['notes']);
    this.direction = dto['direction'];
    this.dnis = dto['dnis'];
    this.ani = dto['ani'];
    this.duration = Number(dto['duration']);
    this.type = dto['type'];
    this.status = dto['status'] ?? 'pending';
  }

  toDto(): { [key: string]: any; } {
    return {
      key: this.key,
      groupId: this.groupId,
      date: this.date,
      notes: JSON.stringify(this.notes),
      direction: this.direction,
      dnis: this.dnis,
      ani: this.ani,
      duration: this.duration,
      type: this.type,
      status: this.status,
    }
  }

  clone(): CustomInteraction {
    return new CustomInteraction(this.toDto());
  }

}

export interface InteractionNote {
  text: string;
  date: string;
  user: string;
}
