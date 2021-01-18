export interface Minutes {
    m00 : number,
    m15 : number,
    m30 : number,
    m45 : number
}

export interface TimeSlotsWithCapacity {
    hour: number,
    minutes: Minutes,
    hourTotal: number
  }