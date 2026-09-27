export type PlayerId = string;
export type RoomId = string;

export interface CarState {
    x: number;
    y: number;
    rotation: number;
    speed: number;
    turbo: number;
}

export interface RacePlayer {
    id: PlayerId;
    name: string;
    car: CarState;
    connected: boolean;
}

export interface RaceRoom {
    id: RoomId;
    players: Map<PlayerId, RacePlayer>;
    started: boolean;
}

export interface PublicRaceRoom {
    id: RoomId;
    players: RacePlayer[];
    started: boolean;
}
