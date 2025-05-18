import { useEffect, useMemo, useState } from "react"
import { todoPrayModel } from "@/firebase/todopray"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import MetaHead from "@/components/common/Head"
import { IoIosArrowUp } from "react-icons/io"

export default function TodoPrays() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [filters, setFilters] = useState({
    schoolCode: "",
    classNumber: "",
    targetPerson: "",
    leader: "",
    teacherName: "",
  })

  const { data: todoPrayList } = useCustomQuery<TodoPray[], Error>({
    key: "allTodoPrayList",
    queryFn: () => todoPrayModel.getTodoPrayList(),
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = document.documentElement.scrollTop
      setShowScrollTop(scrolled > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filteredAndSortedTodoPrayList = useMemo(() => {
    if (!todoPrayList) return []

    let filtered = todoPrayList.filter((todoPray) => {
      const matchSchoolCode =
        !filters.schoolCode || todoPray.schoolCode === filters.schoolCode
      const matchClassNumber =
        !filters.classNumber ||
        todoPray.classNumber?.toString().includes(filters.classNumber)
      const matchTargetPerson =
        !filters.targetPerson ||
        todoPray.targetPerson
          ?.toLowerCase()
          .includes(filters.targetPerson.toLowerCase())
      const matchLeader =
        !filters.leader ||
        todoPray.leader?.toLowerCase().includes(filters.leader.toLowerCase())
      const matchTeacherName =
        !filters.teacherName ||
        todoPray.teacherName
          ?.toLowerCase()
          .includes(filters.teacherName.toLowerCase())

      return (
        matchSchoolCode &&
        matchClassNumber &&
        matchTargetPerson &&
        matchLeader &&
        matchTeacherName
      )
    })

    return filtered.sort((a, b) => {
      const schoolCodeA = a.schoolCode || "MIDDLE"
      const schoolCodeB = b.schoolCode || "MIDDLE"
      if (schoolCodeA !== schoolCodeB) {
        return schoolCodeA === "MIDDLE" ? -1 : 1
      }

      const classNumberA = Number(a.classNumber) || 0
      const classNumberB = Number(b.classNumber) || 0
      if (classNumberA !== classNumberB) {
        return classNumberA - classNumberB
      }

      return (a.leader || "").localeCompare(b.leader || "")
    })
  }, [todoPrayList, filters])

  useEffect(() => {
    console.log("showScrollTop: ", showScrollTop)
  }, [showScrollTop])

  return (
    <div className="w-full flex flex-col items-center gap-5 h-screen overflow-hidden">
      <MetaHead
        title="전체 기도부탁자 | The Note"
        content="전체 기도부탁자 목록"
      />

      <div className="w-full flex flex-col items-center gap-3">
        <div className="text-2xl font-bold pt-4">전체 기도부탁자 목록</div>

        <div className="w-full max-w-4xl flex items-center px-4 justify-center">
          <div className="flex gap-2 min-w-max">
            <select
              name="schoolCode"
              value={filters.schoolCode}
              onChange={handleFilterChange}
              className="select select-bordered select-sm w-24"
            >
              <option value="">전체</option>
              <option value="MIDDLE">중등</option>
              <option value="HIGH">고등</option>
            </select>

            <input
              type="text"
              name="classNumber"
              value={filters.classNumber}
              onChange={handleFilterChange}
              placeholder="반"
              className="input input-bordered input-sm w-16"
            />

            <input
              type="text"
              name="teacherName"
              value={filters.teacherName}
              onChange={handleFilterChange}
              placeholder="분반교사"
              className="input input-bordered input-sm w-24"
            />
          </div>
        </div>

        <div className="w-full max-w-4xl flex items-center px-4 justify-center">
          <div className="flex gap-2 mb-4 min-w-max">
            {/* <select
                  name="schoolCode"
                  value={filters.schoolCode}
                  onChange={handleFilterChange}
                  className="select select-bordered select-sm w-24"
              >
                  <option value="">전체</option>
                  <option value="MIDDLE">중등</option>
                  <option value="HIGH">고등</option>
              </select> */}

            <input
              type="text"
              name="targetPerson"
              value={filters.targetPerson}
              onChange={handleFilterChange}
              placeholder="이름"
              className="input input-bordered input-sm w-24"
            />

            <input
              type="text"
              name="leader"
              value={filters.leader}
              onChange={handleFilterChange}
              placeholder="인도자"
              className="input input-bordered input-sm w-24"
            />

            <button
              onClick={() => {
                setFilters({
                  schoolCode: "",
                  classNumber: "",
                  teacherName: "",
                  targetPerson: "",
                  leader: "",
                })
              }}
              className="btn btn-ghost btn-sm"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-[100%] flex-1 animate-fade-up">
        <ul className="list bg-base-100 rounded-box block w-[100%] h-[60%]">
          {filteredAndSortedTodoPrayList?.map((todoPray) => (
            <li
              key={todoPray.id}
              className="border-b border-base-300 my-1 py-1 px-4"
            >
              <div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">
                    {todoPray.targetPerson}{" "}
                    <span className="text-sm opacity-50">
                      {todoPray.relationship}
                    </span>
                  </div>
                  <div className="text-sm opacity-50">
                    {todoPray.schoolCode === "MIDDLE" ? "중등" : "고등"}{" "}
                    {todoPray.classNumber}반 {todoPray.leader}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="list-col-wrap text-sm">{todoPray.content}</p>
                </div>
                <div className="mt-2 flex justify-end gap-1 text-xs opacity-60">
                  {todoPray.firstHalfAttendance && (
                    <span className="badge badge-soft badge-sm font-bold">
                      상반기 집회
                    </span>
                  )}
                  {todoPray.invitationCount > 0 && (
                    <span className="badge badge-soft badge-sm badge-info font-bold">
                      권유
                    </span>
                  )}
                  {todoPray.mealCount > 0 && (
                    <span className="badge badge-soft badge-sm badge-success font-bold">
                      식사
                    </span>
                  )}
                  {todoPray.isConfirmed && (
                    <span className="badge badge-soft badge-sm badge-primary font-bold">
                      확답
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-focus transition-colors"
        >
          <IoIosArrowUp size={24} />
        </button>
      )}
    </div>
  )
}
