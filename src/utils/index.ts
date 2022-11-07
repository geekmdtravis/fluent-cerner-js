import { makeCclRequest } from './makeCclRequest';
import { openPatientTab } from './openPatientTab';
import { openOrganizerTab } from './openOrganizerTab';

type MPageEventReturn = {
    eventString: string;
    inPowerchart: boolean;
}

export { makeCclRequest, openPatientTab, openOrganizerTab };

export type {MPageEventReturn}
