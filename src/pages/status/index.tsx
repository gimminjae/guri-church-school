import Thermometer from "@/components/common/Themometer";


export default function StatusPage() {


  return (
    <div className="w-full flex flex-col items-center gap-5">
      <Thermometer value={190} max={200} />
    </div>
  )
}
