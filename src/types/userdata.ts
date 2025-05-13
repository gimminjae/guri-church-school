interface UserData {
    // 소속구역
    area: number
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
    classNumber: number
    // 소속 분반 코드
    schoolCode: 'MIDDLE' | 'HIGH'
    // 사용자 uid
    userId: string
}
