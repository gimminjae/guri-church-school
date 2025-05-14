import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import MetaHead from "@/components/common/Head"
import { userDataModel } from "@/firebase/userdata"
import { toast } from "react-toastify"
import useCRouter from "@/hooks/useCRouter"

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

export default function Metadata() {
    const { user, metadata, refetchMetadata } = useAuth()
    const [userData, setUserData] = useState<UserData>(initialUserData)
    const [errors, setErrors] = useState({
        teacherName: "",
        classNumber: ""
    })

    const router = useCRouter()

    const validateUserData = () => {
        let isValid = true
        const newErrors = {
            teacherName: "",
            classNumber: ""
        }

        if (!userData.teacherName.trim()) {
            newErrors.teacherName = "분반교사명은 필수 입력값입니다."
            isValid = false
        }

        if (!userData.classNumber) {
            newErrors.classNumber = "소속 분반은 필수 입력값입니다."
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const saveUserData = useCallback(async () => {
        if (!validateUserData()) {
            return
        }

        const savedUserData = {
            ...userData,
            userId: user?.uid || "",
            name: user?.email?.split("@")[0] || ""
        }
        if (savedUserData?.id) {
            await userDataModel.updateUserData(savedUserData)
            toast.success('사용자 정보가 저장되었습니다.')
        } else {
            await userDataModel.writeUserData(savedUserData)
            toast.success('사용자 정보가 저장되었습니다.')
        }
        router.push({ path: '/' })
        refetchMetadata()
    }, [userData, user, refetchMetadata])

    const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setUserData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }))
        // Clear error when user starts typing
        if (name === 'teacherName' || name === 'classNumber') {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }))
        }
    }

    useEffect(() => {
        if (metadata) {
            setUserData(metadata)
        }
    }, [metadata])

    return (
        <div className="w-full flex flex-col items-center gap-5 p-4">
            <MetaHead title="User Metadata | The Note" content="Manage your user metadata" />

            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6">사용자 정보 관리</h1>

                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
                    <legend className="fieldset-legend"></legend>

                    <label className="label">소속구역</label>
                    <input
                        name="area"
                        className="input w-full"
                        value={userData.area}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(Number(value))) {
                                if (Number(value) === 0) {
                                    e.target.value = ""
                                }
                                handleUserDataChange(e)
                            }
                        }}
                        placeholder="소속구역을 입력하세요"
                    />

                    <label className="label">아버지 성함</label>
                    <input
                        type="text"
                        name="fatherName"
                        className="input w-full"
                        value={userData.fatherName}
                        onChange={handleUserDataChange}
                        placeholder="아버지 성함을 입력하세요"
                    />

                    <label className="label">어머니 성함</label>
                    <input
                        type="text"
                        name="motherName"
                        className="input w-full"
                        value={userData.motherName}
                        onChange={handleUserDataChange}
                        placeholder="어머니 성함을 입력하세요"
                    />

                    <label className="label">분반교사명 *</label>
                    <input
                        type="text"
                        name="teacherName"
                        className={`input w-full ${errors.teacherName ? 'input-error' : ''}`}
                        value={userData.teacherName}
                        onChange={handleUserDataChange}
                        placeholder="분반교사명을 입력하세요"
                    />
                    {errors.teacherName && <div className="text-error text-sm mt-1">{errors.teacherName}</div>}

                    <label className="label">성별</label>
                    <select
                        name="gender"
                        className="select w-full"
                        value={userData.gender}
                        onChange={handleUserDataChange}
                    >
                        <option value="M">남자</option>
                        <option value="W">여자</option>
                    </select>

                    <label className="label">소속 분반 *</label>
                    <input
                        name="classNumber"
                        className={`input w-full ${errors.classNumber ? 'input-error' : ''}`}
                        value={userData.classNumber}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!isNaN(Number(value))) {
                                if (Number(value) === 0) {
                                    e.target.value = ""
                                }
                                handleUserDataChange(e)
                            }
                        }}
                        placeholder="소속 분반을 입력하세요"
                    />
                    {errors.classNumber && <div className="text-error text-sm mt-1">{errors.classNumber}</div>}

                    <label className="label">소속 분반 코드</label>
                    <select
                        name="schoolCode"
                        className="select w-full"
                        value={userData.schoolCode}
                        onChange={handleUserDataChange}
                    >
                        <option value="MIDDLE">중등부</option>
                        <option value="HIGH">고등부</option>
                    </select>
                </fieldset>

                <div className="mt-6">
                    <button className="btn btn-primary w-full" onClick={saveUserData}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    )
}
