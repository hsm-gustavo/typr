export const fetchSentence = async () => {
  const res = await fetch("http://localhost:5001/api/sentence?count=5")
  if (!res.ok) throw new Error("Failed to fetch sentence")
  return res.json()
}
