interface UserData {
    id?: string
    createdAt?: string
    updatedAt?: string
    createdAtTimeStamp?: number
    // 소속구역
    area: number | string
    // 부이름 
    fatherName: string
    // 모이름
    motherName: string
    // 분반교사명
    teacherName: string
    // 분반교사 uid
    teacherId: string
    // 성별 여부
    gender: 'M' | 'W'
    // 소속 분반
    classNumber: number | string
    // 소속 분반 코드
    schoolCode: 'MIDDLE' | 'HIGH'
    // 사용자 uid
    userId: string
    // 사용자 이름
    name: string
    // 분반교사여부
    isTeacher?: boolean
}
