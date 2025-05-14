import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"

interface UserData {
    name: string
    password: string
}

export default function TestPage() {
    const { register } = useAuth()
    const [jsonData, setJsonData] = useState<string>("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Parse JSON data
            const userData: UserData[] = JSON.parse(jsonData)

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
        </div>
    )
}
