import util from "@/util/util"
import { db } from "./firebase"
import {
  ref,
  set,
  get,
  child,
  update,
  remove,
  orderByChild,
  query,
  equalTo,
} from "firebase/database"
import { loadingActions, store } from "@/store//LoadingState"

export const userDataModel = {
  async writeUserData(userData: UserData) {
    const id = util.getUuid()
    const now = new Date()
    const nowStr = util.getFormattedDateTime(now)
    const savedUserData = {
      ...userData,
      id: id,
      createdAt: nowStr,
      updatedAt: nowStr,
      // 소속구역
      area: userData.area,
      // 부이름
      fatherName: userData.fatherName,
      // 모이름
      motherName: userData.motherName,
      // 분반교사명
      teacherName: userData.teacherName,
      // 분반교사 uid
      teacherId: userData.teacherId,
      // 성별 여부
      gender: userData.gender,
      // 소속 분반
      classNumber: userData.classNumber,
      // 소속 분반 코드
      schoolCode: userData.schoolCode,
    }
    set(ref(db, `userData/${id}`), savedUserData)

    return savedUserData
  },

  async getUserDataListByPage(page: number, size: number) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(ref(db, "userData"))
      const result = snapshot?.val()
      if (!result) return []

      const allUserData = Object.values(result)
      const sortedUserData = allUserData.sort(
        (a: any, b: any) => b.createdAt - a.createdAt
      )

      const startIndex = (page - 1) * size
      const endIndex = startIndex + size
      return sortedUserData.slice(startIndex, endIndex)
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getUserDataById(id: string) {
    store.dispatch(loadingActions.loading())
    const result = await get(child(ref(db), `userData/${id}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log("No data available")
        }
      })
      .catch((error) => {
        console.error(error)
      })
    store.dispatch(loadingActions.complete())
    return result
  },

  async getUserDataByTeacherId(teacherId: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "userData"), orderByChild("teacherId"), equalTo(teacherId))
      )
      const result = snapshot?.val()
      return result ? Object.values(result) : []
    } catch (error) {
      console.log(error)
      return []
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async getUserDataList() {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(ref(db, "userData"))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    } catch (error) {
      console.log(error)
    } finally {
      store.dispatch(loadingActions.complete())
    }
  },

  async updateUserData(userData: UserData) {
    try {
      return await update(ref(db, `/userData/${userData?.userId}`), {
        ...userData,
        updatedAt: util.getFormattedCurrentDateTime(),
      })
    } catch (error) {
      console.log(error)
    }
  },

  async deleteUserDataById(userDataId: string) {
    try {
      return await remove(ref(db, `/userData/${userDataId}`))
    } catch (error) {
      console.log(error)
    }
  },
}
