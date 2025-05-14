import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import MetaHead from "@/components/common/Head"
import util from "@/util/util"
import { todoPrayModel } from "@/firebase/todopray"
import { userDataModel } from "@/firebase/userdata"
import { useCustomQuery } from "@/hooks/useCustomQuery"
import { CiEdit, CiTrash } from "react-icons/ci";
import { toast } from "react-toastify"

const initialTodoPray: TodoPray = {
  leader: "",
  targetPerson: "",
  teacherName: "",
  relationship: "",
  content: "",
  firstHalfAttendance: false,
  parentName: "",
  evangelismArea: "",
  invitationCount: 0,
  mealCount: 0,
  isConfirmed: false
}

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

export default function Home() {
  const { user, login, setDisplayName, metadata } = useAuth()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [todoPray, setTodoPray] = useState<TodoPray>(initialTodoPray)
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [errors, setErrors] = useState({
    teacherName: "",
    classNumber: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(`${name}@guri-church.com`, password)
  }

  const { data: todoPrayList, refetch } = useCustomQuery<TodoPray[], Error>({
    key: "todoPrayList",
    queryFn: () => todoPrayModel.getTodoPrayListByUserId(user?.uid || "")
  })

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
        ; (window?.document?.getElementById("user_modal") as any)?.close()
    } else {
      await userDataModel.writeUserData(savedUserData)
      toast.success('사용자 정보가 저장되었습니다.')
        ; (window?.document?.getElementById("user_modal") as any)?.close()
    }
  }, [userData, user])

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
    setTimeout(() => {
      if (user && !metadata) {
        (window?.document?.getElementById("user_modal") as any)?.showModal()
      } else {
        (window?.document?.getElementById("user_modal") as any)?.close()
      }
    }, 1000)
  }, [user, metadata])

  const saveTodoPray = useCallback(async () => {
    const savedTodoPray = todoPray?.id ? {
      ...todoPray,
      targetPerson: todoPray.targetPerson.trim(),
      relationship: todoPray.relationship.trim(),
      content: todoPray.content.trim(),
      firstHalfAttendance: todoPray.firstHalfAttendance,
      parentName: [metadata?.fatherName, metadata?.motherName].filter(name => !!name).join(" / "),
    } : {
      ...todoPray,
      leader: user?.displayName || "",
      parentName: [metadata?.fatherName, metadata?.motherName].filter(name => !!name).join(" / "),
      teacherName: metadata?.teacherName || "",
      teacherId: metadata?.teacherId || "",
      evangelismArea: metadata?.area as number,
      invitationCount: 0,
      mealCount: 0,
      userId: user?.uid || "",
      userEmail: user?.email || "",
    }
    if (savedTodoPray?.id) {
      await todoPrayModel.updateTodoPray(savedTodoPray)
    } else {
      await todoPrayModel.writeTodoPray(savedTodoPray)
    }
    refetch()
    setTodoPray(initialTodoPray)
    toast.success('저장되었습니다.')
  }, [todoPray, user, metadata])

  const handleTodoPrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    setTodoPray(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
        type === 'number' ? Number(value) : value
    }))
  }

  const handleDelete = useCallback((id?: string) => async () => {
    if (id && window.confirm('정말 삭제하시겠습니까?')) {
      await todoPrayModel.deleteTodoPrayById(id)
      refetch()
      toast.success('삭제되었습니다.')
    }
  }, [])

  const handleClick = useCallback(() => {
    setTodoPray(initialTodoPray)
    openModal()
  }, [])

  const openModal = useCallback(() => {
    (window?.document?.getElementById("my_modal_5") as any)?.showModal()
  }, [])

  const handleEdit = useCallback((id?: string) => () => {
    if (id) {
      const todoPray = todoPrayList?.find(todoPray => todoPray.id === id)
      if (todoPray) setTodoPray(todoPray)
      openModal()
    }
  }, [todoPrayList])

  useEffect(() => {
    console.log('todoPrayList', todoPrayList)
  }, [todoPrayList])

  useEffect(() => {
    if (!user?.displayName) {
      setDisplayName(util.getNameByEmail(user?.email || ""))
    }
  }, [user])

  useEffect(() => {
    if (user?.uid) refetch()
  }, [user?.uid])

  const handleIncreaseInvitation = useCallback((id?: string) => async () => {
    if (id) {
      await todoPrayModel.increaseInvitationCount(id)
      refetch()
      // toast.success('권유 횟수가 증가되었습니다.')
    }
  }, [])

  const handleIncreaseMeal = useCallback((id?: string) => async () => {
    if (id) {
      await todoPrayModel.increaseMealCount(id)
      refetch()
      // toast.success('식사 횟수가 증가되었습니다.')
    }
  }, [])

  const handleToggleConfirmed = useCallback((id?: string) => async () => {
    if (id) {
      await todoPrayModel.toggleConfirmed(id)
      refetch()
      // toast.success('확답 여부가 변경되었습니다.')
    }
  }, [])

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <MetaHead title="Home | The Note" content="Welcome to The Note" />

      {user ? (
        <>
          <div className="text-2xl font-bold">
            {user?.displayName ? `환영합니다, ${user?.displayName}${util.getGenderByCode(userData?.gender)}님!` : '환영합니다!'}
          </div>
          <div className="flex justify-center w-[100%]">
            <ul className="list bg-base-100 rounded-box shadow-md block w-[100%]">

              <li className="flex justify-between items-center px-4">
                <div className="pb-2 text-xs opacity-60 tracking-wide font-bold flex items-center gap-2">
                  <span><svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></g></svg></span>
                  나의 전도대상자
                </div>
                <div>
                  <button
                    className="btn btn-sm"
                    onClick={handleClick}
                  >
                    <CiEdit className="mr-2" />기도부탁자 등록
                  </button>
                </div>
              </li>

              {
                todoPrayList?.map((todoPray) => (
                  <li key={todoPray.id} className="border-b border-base-300 my-3 py-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex gap-3 items-center text-xl font-bold">{todoPray.targetPerson}<span className="text-sm uppercase font-semibold opacity-60">{todoPray.relationship}</span></div>
                        </div>
                        <div>
                          <button className="btn btn-square btn-ghost">
                            <CiEdit className="size-[1.5em]" onClick={handleEdit(todoPray?.id)} />
                          </button>
                          <button
                            className="btn btn-square btn-ghost"
                            onClick={handleDelete(todoPray?.id)}
                          >
                            <CiTrash className="size-[1.5em]" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="list-col-wrap text-xs">
                          {todoPray.content}
                        </p>
                      </div>
                      <div className="flex justify-end gap-1 text-xs opacity-60">
                        {todoPray.firstHalfAttendance && <span className="badge badge-soft badge-sm font-bold">상반기 집회</span>}
                        {todoPray.invitationCount > 0 && <span className="badge badge-soft badge-sm badge-info font-bold">권유<div className="badge badge-xs">{todoPray.invitationCount}</div></span>}
                        {todoPray.mealCount > 0 && <span className="badge badge-soft badge-sm badge-success font-bold">식사<div className="badge badge-xs">{todoPray.mealCount}</div></span>}
                        {todoPray.isConfirmed && <span className="badge badge-soft badge-sm badge-primary font-bold">확답</span>}
                      </div>
                      <div className="flex justify-between gap-2">
                        <button className="btn btn-outline btn-info" onClick={handleIncreaseInvitation(todoPray?.id)}>권유했어요</button>
                        <button className="btn btn-outline btn-accent" onClick={handleIncreaseMeal(todoPray?.id)}>식사했어요</button>
                        {todoPray.isConfirmed ? <button className="btn btn-outline btn-primary" onClick={handleToggleConfirmed(todoPray?.id)}>취소됐어요</button> : <button className="btn btn-outline btn-primary" onClick={handleToggleConfirmed(todoPray?.id)}>확답했어요</button>}
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto mt-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                이름
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
            >
              로그인
            </button>
          </form>
        </div>
      )}

      <dialog id="user_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-md sm:max-w-xl mx-0 sm:mx-auto">
          <h3 className="font-bold text-lg">사용자 정보 등록</h3>
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
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn" onClick={saveUserData}>
                저장
              </button>
              <button className="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-md sm:max-w-xl mx-0 sm:mx-auto">
          <h3 className="font-bold text-lg">기도부탁자 등록</h3>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend"></legend>

            <label className="label">전도대상자</label>
            <input
              type="text"
              name="targetPerson"
              className="input w-full"
              value={todoPray.targetPerson}
              onChange={handleTodoPrayChange}
              placeholder="전도대상자명을 입력하세요"
            />

            <label className="label">관계</label>
            <input
              type="text"
              name="relationship"
              className="input w-full"
              value={todoPray.relationship}
              onChange={handleTodoPrayChange}
              placeholder="관계를 입력하세요"
            />

            <label className="label">내용</label>
            <textarea
              name="content"
              className="textarea w-full"
              value={todoPray.content}
              onChange={handleTodoPrayChange}
              placeholder="내용을 입력하세요"
            />

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">상반기 전도집회 출석</span>
                <input
                  type="checkbox"
                  name="firstHalfAttendance"
                  className="checkbox"
                  checked={todoPray.firstHalfAttendance}
                  onChange={handleTodoPrayChange}
                />
              </label>
            </div>

          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn" onClick={saveTodoPray}>
                저장
              </button>
              <button className="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
