export const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

export async function saveShift(data: any) {
  await delay()
  return { ok: true, id: crypto.randomUUID(), ...data }
}

export async function updateShift(id: string, patch: any) {
  await delay()
  return { ok: true, id, ...patch }
}

export async function approveRequest(id: string) {
  await delay()
  return { ok: true, id, status: "Approved" }
}

export async function denyRequest(id: string) {
  await delay()
  return { ok: true, id, status: "Denied" }
}

export async function exportPayrollCsv(rows: any[]) {
  const header = Object.keys(rows[0] ?? {}).join(",")
  const csv = [header, ...rows.map((r: any) => Object.values(r).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "payroll.csv"
  a.click()
  URL.revokeObjectURL(url)
  return { ok: true }
}
