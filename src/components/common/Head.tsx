import Head from "next/head"

interface Props {
    title: string
    content?: string
}

const MetaHead = ({ title = "The Note", content = "The Note" }: Props) => {
  return (
    <Head>
        <title>{title}</title>
        <meta name="description" content={content} />
    </Head>
  )
}

export default MetaHead
