import { useCallback, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import MetaHead from "@/components/common/Head"
import useCRouter from "@/hooks/useCRouter"
import { toast } from "react-toastify"

export default function ChangePassword() {
    const { user, changePassword, logout } = useAuth()
    const router = useCRouter()
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('')

    const handleChangePassword = useCallback(async () => {
        if (newPassword.length < 6) {
            toast.error('비밀번호는 6자 이상이어야 합니다.')
            return
        }
        if (newPassword === newPasswordConfirm) {
            try {
                await changePassword(newPassword)
                toast.success('비밀번호가 변경되었습니다.')
                setTimeout(async () => {
                    await logout()
                    router.push({ path: '/' })
                }, 2000)
            } catch (error) {
                toast.error('비밀번호 변경에 실패했습니다.')
                console.error(error)
            }
        } else {
            toast.error('비밀번호가 일치하지 않습니다.')
        }
    }, [newPassword, newPasswordConfirm, changePassword, logout, router])

    return (
        <div className="w-full flex flex-col items-center gap-5 p-4">
            <MetaHead title="비밀번호 변경" content="Change your password" />

            <div className="max-w-md w-full">
                <h1 className="text-2xl font-bold mb-6">비밀번호 변경</h1>

                <div className="bg-base-200 rounded-box w-full shadow-lg p-4">
                    <div className="form-control space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text">새 비밀번호</span>
                            </label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="label">
                                <span className="label-text">새 비밀번호 확인</span>
                            </label>
                            <input
                                type="password"
                                className="input input-bordered w-full"
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            />
                        </div>
                        <div className="mt-6">
                            <button className="btn btn-primary w-full" onClick={handleChangePassword}>
                                변경하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
