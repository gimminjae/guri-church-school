import { useEffect, useMemo } from "react"
import { todoPrayModel } from "@/firebase/todopray"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import MetaHead from "@/components/common/Head"

export default function TodoPrays() {
    const { data: todoPrayList } = useCustomQuery<TodoPray[], Error>({
        key: "allTodoPrayList",
        queryFn: () => todoPrayModel.getTodoPrayList()
    })

    useEffect(() => {
        console.log('all todoPrayList', todoPrayList)
    }, [todoPrayList])

    const sortedTodoPrayList = useMemo(() => {
        if (!todoPrayList) return []

        return [...todoPrayList].sort((a, b) => {
            // 1. 중등/고등 비교 (중등이 먼저)
            const schoolCodeA = a.schoolCode || 'MIDDLE'
            const schoolCodeB = b.schoolCode || 'MIDDLE'
            if (schoolCodeA !== schoolCodeB) {
                return schoolCodeA === 'MIDDLE' ? -1 : 1
            }

            // 2. 반 숫자 순 정렬
            const classNumberA = Number(a.classNumber) || 0
            const classNumberB = Number(b.classNumber) || 0
            if (classNumberA !== classNumberB) {
                return classNumberA - classNumberB
            }

            // 3. leader 이름 정렬
            return (a.leader || '').localeCompare(b.leader || '')
        })
    }, [todoPrayList])

    return (
        <div className="w-full flex flex-col items-center gap-5">
            <MetaHead title="전체 기도부탁자 | The Note" content="전체 기도부탁자 목록" />

            <div className="text-2xl font-bold">전체 기도부탁자 목록</div>

            <div className="flex justify-center w-[100%]">
                <ul className="list bg-base-100 rounded-box block w-[100%]">
                    {sortedTodoPrayList?.map((todoPray) => (
                        <li key={todoPray.id} className="border-b border-base-300 my-1 py-1 px-4">
                            <div>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm font-bold">{todoPray.targetPerson} <span className="text-sm opacity-50">{todoPray.relationship}</span></div>
                                    <div className="text-sm opacity-50">{todoPray.leader}</div>
                                </div>
                                <div className="mt-2">
                                    <p className="list-col-wrap text-sm">{todoPray.content}</p>
                                </div>
                                <div className="mt-2 flex justify-end gap-1 text-xs opacity-60">
                                    {todoPray.firstHalfAttendance && <span className="badge badge-soft badge-sm font-bold">상반기 집회</span>}
                                    {todoPray.invitationCount > 0 && <span className="badge badge-soft badge-sm badge-info font-bold">권유</span>}
                                    {todoPray.mealCount > 0 && <span className="badge badge-soft badge-sm badge-success font-bold">식사</span>}
                                    {todoPray.isConfirmed && <span className="badge badge-soft badge-sm badge-primary font-bold">확답</span>}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
