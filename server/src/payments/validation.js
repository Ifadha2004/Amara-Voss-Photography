// Check signed Stripe data against our immutable database snapshot.
export function matchesOrder(session, order) {
  return session.livemode === false && session.mode === "payment" &&
    session.client_reference_id === order.id && session.metadata?.orderId === order.id &&
    session.currency === order.currency && session.amount_total === order.total_amount &&
    (!order.stripe_session_id || order.stripe_session_id === session.id);
}
