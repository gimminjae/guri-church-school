import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import MetaHead from "@/components/common/Head"
import util from "@/util/util"

export default function Home() {
  const { user, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(`${email}@guri-church.com`, password)
  }

  return (
    <div className="min-h-screen">
      <MetaHead title="Home | The Note" content="Welcome to The Note" />

      {user ? (
        <div className="text-2xl font-bold">
          환영합니다, {util.getNameByEmail(user?.email || "")}님!
        </div>
      ) : (
        <div className="max-w-md mx-auto mt-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                이메일
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="이메일을 입력하세요"
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
      <div>
        <button
          className="btn"
          onClick={() =>
            (window?.document?.getElementById("my_modal_5") as any)?.showModal()
          }
        >
          기도부탁자 등록
        </button>
      </div>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">기도부탁자 등록</h3>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
            <legend className="fieldset-legend"></legend>

            <label className="label">Title</label>
            <input
              type="text"
              className="input"
              placeholder="My awesome page"
            />

            <label className="label">Slug</label>
            <input
              type="text"
              className="input"
              placeholder="my-awesome-page"
            />

            <label className="label">Author</label>
            <input type="text" className="input" placeholder="Name" />
          </fieldset>
          <div className="modal-action">
            <form method="dialog" className="flex gap-3">
              <button className="btn" onClick={() => console.log("e")}>
                저장
              </button>
              <button className="btn">취소</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}
