export interface ITransfer {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    integration: number
    domain: string
    amount: number
    currency: string
    source: string
    reason: string
    recipient: number
    status: string
    transfer_code: string
    id: number
    createdAt: string
    updatedAt: string
}
