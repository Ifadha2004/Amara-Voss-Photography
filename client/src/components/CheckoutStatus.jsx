import { useEffect, useState } from "react"
import { authClient } from "../lib/auth-client"

const money = (amount) => new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED" }).format(amount / 100)

export default function CheckoutStatus() {
  const { data: session, isPending } = authClient.useSession()
  const [order, setOrder] = useState(null)
  const [message, setMessage] = useState("")
  const [attempt, setAttempt] = useState(0)
  const [waiting, setWaiting] = useState(true)
  const params = new URLSearchParams(window.location.search)
  const orderId = params.get("order")
  const cancelled = params.get("checkout") === "cancelled"
  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) return
    const controller = new AbortController()
    let timer
    let count = 0
    async function check() {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId ?? "")}`, { signal: controller.signal })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Could not check payment")
        if (controller.signal.aborted) return
        setOrder(data)
        setMessage("")
        if (data.status === "pending" && ++count < 15 && !cancelled) {
          timer = setTimeout(check, 2000)
        } else {
          setWaiting(false)
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setMessage(error.message)
          setWaiting(false)
        }
      }
    }
    check()
    return () => { controller.abort(); clearTimeout(timer) }
  }, [userId, orderId, cancelled, attempt])

  const paid = order?.status === "paid"
  return (
    <main className="mx-auto min-h-[65vh] max-w-2xl px-6 py-24">
      <p className="mb-3 text-sm text-accent">STRIPE TEST CHECKOUT</p>
      <h1 className="font-heading text-3xl font-bold">{paid ? "Payment confirmed" : cancelled ? "Checkout closed" : "Checking your payment"}</h1>
      <div className="mt-6 rounded-md bg-surface p-6" aria-live="polite">
        {isPending ? <p>Checking your session…</p> : !userId ? <p>Sign in above with the account used for checkout to view this order.</p> : <>
          {message && <p role="alert">{message}</p>}
          {order && <>
            <p className="break-all text-sm text-muted">Order {order.id}</p>
            <p className="mt-3">Status: <strong>{order.status}</strong></p>
            <ul className="mt-4 space-y-2">{order.items.map((item, index) => <li key={index}>{item.quantity} × {item.title} — {money(item.quantity * item.unit_amount)}</li>)}</ul>
            <p className="mt-4 font-medium">Total: {money(order.total_amount)}</p>
            {paid && <p className="mt-3">Your spots are confirmed. Thank you!</p>}
            {order.status === "pending" && <p className="mt-3 text-muted">{cancelled ? "No payment is confirmed. Unpaid seats are released after Stripe expires the session (about 30 minutes)." : waiting ? "Waiting for Stripe’s confirmation…" : "Confirmation is taking longer. Check again shortly; please avoid paying twice."}</p>}
            {order.status === "expired" && <p className="mt-3">This checkout expired. Return to events to try again.</p>}
            {order.status === "failed" && <p className="mt-3">Checkout could not be created. Return to events to try again.</p>}
          </>}
          {!paid && !waiting && <button type="button" className="mt-4 text-accent underline" onClick={() => { setWaiting(true); setAttempt((n) => n + 1) }}>Check again</button>}
        </>}
      </div>
      <a href="/#events" className="mt-6 inline-block text-accent underline">Back to events</a>
    </main>
  )
}
