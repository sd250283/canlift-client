// Interface for API responses and type safety
export interface IElevator {
    id?: number | null;
    name: string;
    code: string;
    type: string;
    capacity: number;
    active: boolean;
}

// Class implementation with business logic
export class Elevator implements IElevator {
    id?: number | null;
    name: string;
    code: string;
    type: string;
    capacity: number;
    active: boolean;

    constructor(data: Partial<IElevator> = {}) {
        this.id = data.id ?? null;
        this.name = data.name ?? '';
        this.code = data.code ?? '';
        this.type = data.type ?? '';
        this.capacity = data.capacity ?? 0;
        this.active = data.active ?? true;
    }
}

export function createElevator(data: Partial<IElevator> = {}): Elevator {
    return new Elevator(data);
}