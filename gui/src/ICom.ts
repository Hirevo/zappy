interface IGeneralResp {
    "type": string,
    "response-type": string
}

interface IGeneralEvt {
    type: string,
    "event-type": string
}

export interface IMapSize extends IGeneralResp {
    size: {
        width: number,
        height: number
    }
}

export interface ITileResp extends IGeneralResp {
    pos: {
        x: number,
        y: number
    },
    data: [{
        type: string,
        amount: number
    }]
}

export interface IDataResp {
    type: string,
    amount: number
}

export interface IEntitiesResp extends IGeneralResp {
    data: [{
        type: string
        data: [{
            pos: {
                x: number,
                y: number,
            }
            amount: number
        }]
    }]
}

export interface IIncantation {
    id: number,
    "current-level": number
}

export interface IEgg {
    "player-id": number,
    "egg-id": number,
    team: string,
    pos: {
        x: number,
        y: number
    }
}

export interface IPlayerEntity {
    pos: {
        x: number,
        y: number
    },
    id: number,
    team: string,
    facing: "N" | "E" | "S" | "O",
    level: number
}




export interface IGeneralCommandCom {
    command: string
}

export interface ITileCommand extends IGeneralCommandCom {
    pos: {
        x: number,
        y: number
    }
}