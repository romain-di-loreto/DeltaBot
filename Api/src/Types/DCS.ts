
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

export type DB_DCSProfile = {
    id: number,
    user_id: number,
    discord_name: string,
    name: string | null,
    modex: string | null
}

export type DB_DCSPlane = {
    id: number,
    name: string
}

export type DB_DCSMap = {
    id: number,
    name: string
}

export type DB_DCSFlightGroup = {
    id: number,
    name: string
}

export type DB_DCSFlightMember = {
    id: number,
    profile_id: number,
    group_id: number,
    plane_id: number,
    position: number
}

export type DB_DCSSession = {
    id: number,
    name: string | null,
    plane_id: number,
    map_id: number,
    role: string,
    flight_group_id: number | null
}