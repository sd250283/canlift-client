interface SimulationSlotConstructorParams {
    createdAt?: any;
    deskSells?: number | null;
    eastElevatorRate?: number | null;
    endTime?: string | null;
    id?: number | null;
    isActionZone?: boolean | null;
    isAffectedByEvents?: boolean | null;
    isRedZone?: boolean | null;
    messageModelStair?: any;
    messageModelElevator?: any;
    northElevatorRate?: number | null;
    onlineSells?: number | null;
    receptionRoomSells?: number | null;
    restaurantSells?: number | null;
    stairVisitors?: number | null;
    startTime?: string | null;
    toContactElevator?: any;
    toContactTop?: any;
    toContactStair?: any;
    totalElevationCapacity?: number | null;
    updatedAt?: any;
    waitingVisitors?: number | null;
    westElevatorRate?: number | null;
}

export class SimulationSlot {
    id: number | null;
    createdAt: any;
    deskSells: number | null;
    eastElevatorRate: number | null;
    endTime: string | null;
    isActionZone: boolean | null;
    isAffectedByEvents: boolean | null;
    isRedZone: boolean | null;
    messageModelStair: any;
    messageModelElevator: any;
    northElevatorRate: number | null;
    onlineSells: number | null;
    receptionRoomSells: number | null;
    restaurantSells: number | null;
    stairVisitors: number | null;
    startTime: string | null;
    toContactElevator: any;
    toContactTop: any;
    toContactStair: any;
    totalElevationCapacity: number | null;
    updatedAt: any;
    waitingVisitors: number | null;
    westElevatorRate: number | null;

    constructor (
        {
            createdAt = null,
            deskSells = null,
            eastElevatorRate = null,
            endTime = null,
            id = null,
            isActionZone = null,
            isAffectedByEvents = null,
            isRedZone = null,
            messageModelStair = null,
            messageModelElevator = null,
            northElevatorRate = null,
            onlineSells = null,
            receptionRoomSells = null,
            restaurantSells = null,
            stairVisitors = null,
            startTime = null,
            toContactElevator = null,
            toContactTop = null,
            toContactStair = null,
            totalElevationCapacity = null,
            updatedAt = null,
            waitingVisitors = null,
            westElevatorRate = null
        }: SimulationSlotConstructorParams = {}
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.deskSells = deskSells;
        this.eastElevatorRate = eastElevatorRate;
        this.endTime = endTime;
        this.isActionZone = isActionZone;
        this.isAffectedByEvents = isAffectedByEvents;
        this.isRedZone = isRedZone;
        this.messageModelStair = messageModelStair ? messageModelStair.id : null;
        this.messageModelElevator = messageModelElevator ? messageModelElevator.id : null;
        this.northElevatorRate = northElevatorRate;
        this.onlineSells = onlineSells;
        this.receptionRoomSells = receptionRoomSells;
        this.restaurantSells = restaurantSells;
        this.stairVisitors = stairVisitors;
        this.startTime = startTime;
        this.toContactElevator = toContactElevator;
        this.toContactTop = toContactTop;
        this.toContactStair = toContactStair;
        this.totalElevationCapacity = totalElevationCapacity;
        this.updatedAt = updatedAt;
        this.waitingVisitors = waitingVisitors;
        this.westElevatorRate = westElevatorRate;
    }
}

export function createSimulationSlot (data: any): SimulationSlot {
    return new SimulationSlot(data);
}