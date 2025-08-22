// Interface for API responses and type safety
export interface IMessageModel {
  id?: number | null;
  name: string;
  type: string;
  cancelSlot?: any; // Consider using a more specific type
}

// Class implementation with business logic
export class MessageModel implements IMessageModel {
    id?: number | null;
    name: string;
    type: string;
    cancelSlot?: any;

    constructor (
        {
            id = null,
            name = '',
            type = '',
            cancelSlot = null
        }: Partial<IMessageModel> = {}
    ) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.cancelSlot = cancelSlot;
    }
}

export function createMessageModel (data: Partial<IMessageModel> = {}): MessageModel {
    return new MessageModel(data);
}