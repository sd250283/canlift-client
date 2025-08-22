export class SimulationConfig {
    id: number | null;
    date: string;
    elevatorConfig: any[]; // Replace 'any' with a more specific type if you have one
    elevatorsAffectedByEvents: boolean;
    stairsAffectedByEvents: boolean;
    topAffectedByEvents: boolean;
    guidedTourAffectedByEvents: boolean;
    guidedTourNotAffectedByEvents: boolean;
    brunchAffectedByEvents: boolean;
    brunchNotAffectedByEvents: boolean;
    upsellRstoAffectedByEvents: boolean;
    upsellRstoNotAffectedByEvents: boolean;

    constructor(
        {
            id = null,
            date = '',
            elevatorConfig = [],
            elevatorsAffectedByEvents = false,
            stairsAffectedByEvents = false,
            topAffectedByEvents = false,
            guidedTourAffectedByEvents = false,
            guidedTourNotAffectedByEvents = true,
            brunchAffectedByEvents = false,
            brunchNotAffectedByEvents = false,
            upsellRstoAffectedByEvents = false,
            upsellRstoNotAffectedByEvents = false
        }: {
            id?: number | null,
            date?: string,
            elevatorConfig?: any[],
            elevatorsAffectedByEvents?: boolean,
            stairsAffectedByEvents?: boolean,
            topAffectedByEvents?: boolean,
            guidedTourAffectedByEvents?: boolean,
            guidedTourNotAffectedByEvents?: boolean,
            brunchAffectedByEvents?: boolean,
            brunchNotAffectedByEvents?: boolean,
            upsellRstoAffectedByEvents?: boolean,
            upsellRstoNotAffectedByEvents?: boolean
        }
    ) {
        this.id = id;
        this.date = date;
        this.elevatorConfig = elevatorConfig;
        this.elevatorsAffectedByEvents = elevatorsAffectedByEvents;
        this.stairsAffectedByEvents = stairsAffectedByEvents;
        this.topAffectedByEvents = topAffectedByEvents;
        this.guidedTourAffectedByEvents = guidedTourAffectedByEvents;
        this.guidedTourNotAffectedByEvents = guidedTourNotAffectedByEvents;
        this.brunchAffectedByEvents = brunchAffectedByEvents;
        this.brunchNotAffectedByEvents = brunchNotAffectedByEvents;
        this.upsellRstoAffectedByEvents = upsellRstoAffectedByEvents;
        this.upsellRstoNotAffectedByEvents = upsellRstoNotAffectedByEvents;
    }
}

export function createSimulationConfig(data: any): SimulationConfig {
    return new SimulationConfig(data);
}
