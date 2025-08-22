import { createSimulationSlot, SimulationSlot } from './SimulationSlot';
import { Elevator } from './Elevator';

// Interface for API responses and type safety
export interface ISimulation {
    id?: number | null;
    createdBy?: any;
    date: string;
    startTime: string;
    endTime: string;
    step: string;
    redZone: string;
    simulationSlots: SimulationSlot[];
    simulationElevators: Elevator[];
    elevatorsAffectedByEvents: boolean;
    stairsAffectedByEvents: boolean;
    topAffectedByEvents: boolean;
    guidedTourAffectedByEvents: boolean;
    brunchAffectedByEvents: boolean;
    upsellRstoAffectedByEvents: boolean;
    guidedTourNotAffectedByEvents: boolean;
    brunchNotAffectedByEvents: boolean;
    upsellRstoNotAffectedByEvents: boolean;
    createdAt?: any;
    ticketOfficeLastUpdate?: any;
    eventTarget: string;
    eventTargetOptions: string[];
}

// Class implementation with business logic
export class Simulation implements ISimulation {
    id?: number | null;
    createdBy: any;
    date: string;
    startTime: string;
    endTime: string;
    step: string;
    redZone: string;
    simulationSlots: SimulationSlot[];
    simulationElevators: Elevator[];
    elevatorsAffectedByEvents: boolean;
    stairsAffectedByEvents: boolean;
    topAffectedByEvents: boolean;
    guidedTourAffectedByEvents: boolean;
    brunchAffectedByEvents: boolean;
    upsellRstoAffectedByEvents: boolean;
    guidedTourNotAffectedByEvents: boolean;
    brunchNotAffectedByEvents: boolean;
    upsellRstoNotAffectedByEvents: boolean;
    createdAt: any;
    ticketOfficeLastUpdate: any;
    eventTarget: string;
    eventTargetOptions: string[];

    constructor (data: Partial<ISimulation> = {}) {
        this.id = data.id ?? null;
        this.createdBy = data.createdBy ?? {};
        this.date = data.date ?? '';
        this.startTime = data.startTime ?? '';
        this.endTime = data.endTime ?? '';
        this.step = data.step ?? '';
        this.redZone = data.redZone ?? '';
        this.simulationSlots = this.createSimulationSlots(data.simulationSlots ?? []);
        this.simulationElevators = data.simulationElevators ?? [];
        this.elevatorsAffectedByEvents = data.elevatorsAffectedByEvents ?? false;
        this.topAffectedByEvents = data.topAffectedByEvents ?? false;
        this.guidedTourAffectedByEvents = data.guidedTourAffectedByEvents ?? false;
        this.brunchAffectedByEvents = data.brunchAffectedByEvents ?? false;
        this.upsellRstoAffectedByEvents = data.upsellRstoAffectedByEvents ?? false;
        this.stairsAffectedByEvents = data.stairsAffectedByEvents ?? false;
        this.createdAt = data.createdAt ?? null;
        this.ticketOfficeLastUpdate = data.ticketOfficeLastUpdate ?? null;
        this.eventTarget = data.eventTarget ?? '';
        this.eventTargetOptions = [];
        this.guidedTourNotAffectedByEvents = data.guidedTourNotAffectedByEvents ?? true;
        this.brunchNotAffectedByEvents = data.brunchNotAffectedByEvents ?? false;
        this.upsellRstoNotAffectedByEvents = data.upsellRstoNotAffectedByEvents ?? false;
        
        // Handle special eventTargetOptions logic
        if (this.guidedTourNotAffectedByEvents) {
            this.eventTargetOptions.push('exclude_guided_tour');
        }
        if (this.brunchNotAffectedByEvents) {
            this.eventTargetOptions.push('exclude_brunch');
        }
        if (this.upsellRstoNotAffectedByEvents) {
            this.eventTargetOptions.push('exclude_upsell_rsto');
        }
    }

    createSimulationSlots (simulationSlots: any) {
        return simulationSlots.map((element: any) => createSimulationSlot(element));
    }
}

export function createSimulation (data: Partial<ISimulation> = {}): Simulation {
    return new Simulation(data);
}
