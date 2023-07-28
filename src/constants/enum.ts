export enum TripStatus {
  CREATED = 'CREATED', // chuyến đi đã được tạo

  ACCEPTED = 'ACCEPTED', // tài xế đồng ý, đang đến điểm xuất phát
  ARRIVED_START = 'ARRIVED_START', // tài xế đã đến điểm xuất phát

  RUNNING = 'RUNNING', // tài xế đang lái xe đến vị trí kết thúc
  FINISHED = 'FINISHED', // đã hoàn thành

  CANCELED = 'CANCELED', // bị huỷ bỏ
}

export enum Role {
  PASSENGER = 'USER',
  DRIVER = 'DRIVER',
}
