interface TodoPray {
  id?: string
  createdAt?: string
  updatedAt?: string
  createdAtTimeStamp?: number
  leader: string // 인도자
  targetPerson: string // 전도대상자
  teacherName: string // 분반교사명
  relationship: string // 관계
  content: string // 내용
  firstHalfAttendance: boolean // 상반기 전도집회 출석
  parentName?: string // 학부모명
  evangelismArea: number | string // 전도구역
  invitationCount: number // 권유횟수
  mealCount: number // 식사횟수
  isConfirmed: boolean // 확답여부
  userId?: string
  userEmail?: string
  teacherId?: string
}
