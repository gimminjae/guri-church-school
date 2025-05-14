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
    // Get teacherId from userData based on teacherName
    let teacherId = ""
    const userDataSnapshot = await userDataModel.getUserDataByName(userData.teacherName)
    if (userDataSnapshot?.exists()) {
      const userData = Object.values(userDataSnapshot.val())[0] as UserData
      console.log(userData)
      teacherId = userData.userId
    }
    const savedUserData = {
      ...userData,
      id: id,
      createdAt: nowStr,
      updatedAt: nowStr,
      // 소속구역
      area: userData.area as number,
      // 부이름
      fatherName: userData.fatherName,
      // 모이름
      motherName: userData.motherName,
      // 분반교사명
      teacherName: userData.teacherName,
      // 분반교사 uid
      teacherId: teacherId,
      // 성별 여부
      gender: userData.gender,
      // 소속 분반
      classNumber: userData.classNumber as number,
      // 소속 분반 코드
      schoolCode: userData.schoolCode,
    }
    set(ref(db, `userData/${id}`), savedUserData)

    return savedUserData
  },

  async getUserDataByName(name: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "userData"), orderByChild("name"), equalTo(name))
      )
      return snapshot
    } catch (error) {
      console.error(error)
      return null
    } finally {
      store.dispatch(loadingActions.complete())
    }
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

  async getUserDataByUserId(userId: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "userData"), orderByChild("userId"), equalTo(userId))
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

  async getUserDataByTeacherName(teacherName: string) {
    store.dispatch(loadingActions.loading())
    try {
      const snapshot = await get(
        query(ref(db, "userData"), orderByChild("teacherName"), equalTo(teacherName))
      )
      return snapshot
    } catch (error) {
      console.log(error)
      return null
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
