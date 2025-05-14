import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import { userDataModel } from "@/firebase/userdata"

interface RegisterData {
    name: string
    password: string
}

interface UserData {
    area: string
    fatherName: string
    motherName: string
    teacherName: string
    teacherId: string
    gender: string
    classNumber: string
    schoolCode: string
    userId: string
    name: string
}

export default function TestPage() {
    const { register } = useAuth()
    const [jsonData, setJsonData] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Parse JSON data
            const userData: RegisterData[] = JSON.parse(jsonData)

            // Register each user
            for (const user of userData) {
                const email = `${user.name}@guri-church.com`
                try {
                    await register(email, user.password)
                    toast.success(`${user.name} 회원가입 성공`)
                } catch (error) {
                    console.error(`Failed to register ${user.name}:`, error)
                    toast.error(`${user.name} 회원가입 실패`)
                }
            }
        } catch (error) {
            console.error("Invalid JSON data:", error)
            toast.error("올바른 JSON 형식이 아닙니다")
        }
    }

    const [userdataJson, setUserdataJson] = useState<string>("")

    const initialUserData: UserData = {
        area: "",
        fatherName: "",
        motherName: "",
        teacherName: "",
        teacherId: "",
        gender: "M",
        classNumber: "",
        schoolCode: "MIDDLE",
        userId: "",
        name: ""
    }
    const handleUserDataSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Parse JSON data
            const userDataList = JSON.parse(userdataJson)

            // Create userdata for each user
            for (const userData of userDataList) {
                try {
                    // Check if user data already exists
                    const existingData = await userDataModel.getUserDataByUserId(userData.userId as string)

                    if (existingData && existingData.length > 0) {
                        alert(`${userData.name}의 유저데이터가 이미 존재합니다.`)
                        continue
                    }

                    await userDataModel.writeUserData({
                        ...initialUserData,
                        userId: userData.userId as string,
                        name: userData.name as string,
                        schoolCode: userData.schoolCode as string,
                        classNumber: userData.classNumber as string,
                        gender: userData.gender as string
                    })
                    toast.success(`${userData.name} 유저데이터 생성 성공`)
                } catch (error) {
                    console.error(`Failed to create userdata for ${userData.name}:`, error)
                    toast.error(`${userData.name} 유저데이터 생성 실패`)
                }
            }
        } catch (error) {
            console.error("Invalid JSON data:", error)
            toast.error("올바른 JSON 형식이 아닙니다")
        }
    }

    return (
        <div className="w-full max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="jsonData" className="block text-sm font-medium">
                        JSON 데이터 입력
                    </label>
                    <textarea
                        id="jsonData"
                        value={jsonData}
                        onChange={(e) => setJsonData(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 h-48"
                        placeholder='[{"name": "홍길동", "password": "123456"}]'
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                    회원가입 처리
                </button>
            </form>

            <form onSubmit={handleUserDataSubmit} className="space-y-4 mt-10">
                <div>
                    <label htmlFor="userdataJson" className="block text-sm font-medium">
                        유저데이터 JSON 입력
                    </label>
                    <textarea
                        id="userdataJson"
                        value={userdataJson}
                        onChange={(e) => setUserdataJson(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 h-48"
                        placeholder='[{"userId": "uid123", "name": "홍길동", "schoolCode": "MIDDLE", "classNumber": "1", "gender": "M"}]'
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                    유저데이터 생성
                </button>
            </form>
        </div>
    )
}
