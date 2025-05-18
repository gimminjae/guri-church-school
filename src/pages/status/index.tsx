import { todoPrayModel } from "@/firebase/todopray"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { useMemo } from "react"

export default function StatusPage() {
  const { data: todoPrayList } = useCustomQuery<TodoPray[], Error>({
    key: "allTodoPrayList",
    queryFn: () => todoPrayModel.getTodoPrayList(),
  })

  const stats = useMemo(() => {
    if (!todoPrayList)
      return {
        totalInvitations: 0,
        totalMeals: 0,
        totalConfirmed: 0,
      }

    return todoPrayList.reduce(
      (acc, todoPray) => {
        return {
          totalInvitations:
            acc.totalInvitations + (todoPray.invitationCount || 0),
          totalMeals: acc.totalMeals + (todoPray.mealCount || 0),
          totalConfirmed: acc.totalConfirmed + (todoPray.isConfirmed ? 1 : 0),
        }
      },
      {
        totalInvitations: 0,
        totalMeals: 0,
        totalConfirmed: 0,
      }
    )
  }, [todoPrayList])

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <h1>권유횟수: {stats.totalInvitations}</h1>
      <h1>식사횟수: {stats.totalMeals}</h1>
      <h1>확답횟수: {stats.totalConfirmed}</h1>
    </div>
  )
}
