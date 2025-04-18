"use server"

export const fetchSentence = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/sentence?count=5`
  )
  if (!res.ok) throw new Error("Failed to fetch sentence")
  return res.json()
}
