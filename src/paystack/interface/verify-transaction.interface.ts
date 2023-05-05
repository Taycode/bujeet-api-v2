export interface IVerifyTransaction {
    status: boolean
    message: string
    data: Data
}

export interface Data {
    id: number
    domain: string
    status: string
    reference: string
    amount: number
    message: any
    gateway_response: string
    paid_at: string
    created_at: string
    channel: string
    currency: string
    ip_address: string
    metadata: string
    log: Log
    fees: number
    fees_split: any
    authorization: Authorization
    customer: Customer
    plan: any
    split: Split
    order_id: any
    paidAt: string
    createdAt: string
    requested_amount: number
    pos_transaction_data: any
    source: any
    fees_breakdown: any
    transaction_date: string
    plan_object: PlanObject
    subaccount: Subaccount
}

export interface Log {
    start_time: number
    time_spent: number
    attempts: number
    errors: number
    success: boolean
    mobile: boolean
    input: any[]
    history: History[]
}

export interface History {
    type: string
    message: string
    time: number
}

export interface Authorization {
    authorization_code: string
    bin: string
    last4: string
    exp_month: string
    exp_year: string
    channel: string
    card_type: string
    bank: string
    country_code: string
    brand: string
    reusable: boolean
    signature: string
    account_name: any
}

export interface Customer {
    id: number
    first_name: any
    last_name: any
    email: string
    customer_code: string
    phone: any
    metadata: any
    risk_action: string
    international_format_phone: any
}

export interface Split {}

export interface PlanObject {}

export interface Subaccount {}
