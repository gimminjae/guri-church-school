import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { auth } from "../firebase/firebase"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  updateProfile,
  updatePassword,
} from "firebase/auth"
import { userDataModel } from "@/firebase/userdata"

// 컨텍스트 타입 정의
interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  setDisplayName: (displayName: string) => Promise<void>
  metadata: UserData | null
  changePassword: (password: string) => Promise<void>
}

// AuthContext 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
  loginWithGoogle: async () => { },
  setDisplayName: async () => { },
  metadata: null,
  changePassword: async () => { },
})

// AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [metadata, setMetadata] = useState<UserData | null>(null)

  useEffect(() => {
    if (user?.uid) {
      const getMetadata = async () => {
        const userData = await userDataModel.getUserDataByUserId(user.uid)
        setMetadata(userData[0] as UserData)
      }
      getMetadata()
    }
  }, [user?.uid])

  // 사용자 상태 업데이트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser)
    return () => unsubscribe()
  }, [])

  // 로그인 함수
  const login = async (email: string, password: string) => {
    try {
      console.log('로그인 시도:', auth, email, password)
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('로그인 성공:', result)
    } catch (error) {
      console.error("로그인 실패:", error)
      throw error
    }
  }

  // 회원가입 함수
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const changePassword = async (password: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, password)
    }
  }

  // 로그아웃 함수
  const logout = async () => {
    await signOut(auth)
  }

  // Google 로그인 함수
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Google 로그인 실패:", error)
    }
  }

  const setDisplayName = async (displayName: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName })
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loginWithGoogle, setDisplayName, changePassword, metadata }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
