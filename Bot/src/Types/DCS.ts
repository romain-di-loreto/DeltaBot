
import { BotUser } from "./Discord"

export type DCSProfile = {
    id: number,
    user: BotUser,
    discordName: string,
    dcsUsername?: string,
    modex?: string,
    planes: Plane[],
    maps: Map[],
    sessions: Session[]
}

export type FlightMember = {
    profile: DCSProfile,
    plane: Plane,
    position: FlightPosition,
}

export enum FlightPosition {
    Leader = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
}

export type Plane = {
    id: number,
    name: string
}

export type Map = {
    id: number,
    name: string
}

export type Session = {
    id: number,
    name?: string,
    plane: Plane,
    map: Map,
    flightGroup?: FlightGroup
}

export type FlightGroup = {
    id: number,
    members: FlightMember[],
    name: string,
}