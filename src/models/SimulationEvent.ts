export class SimulationEvent {
    id?: number | null;
    startTime: string;
    endTime: string;
    rate: number;
    simulationElevator: any;
    reserveElevatorStartTime: string;

    constructor (
        {
            id = null,
            startTime = ``,
            endTime = ``,
            rate = 0,
            simulationElevator = null,
            reserveElevatorStartTime = ``
        } = {}
    ) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.rate = rate;
        this.simulationElevator = simulationElevator;
        this.reserveElevatorStartTime = reserveElevatorStartTime;
    }
}

export function createSimulationEvent (data: any) {
    return new SimulationEvent(data);
}