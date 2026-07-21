import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute(
  "SELECT id, patientName, status, stripeMode, stripeCustomerId, stripePaymentMethodId, depositPaymentIntentId FROM payments ORDER BY createdAt DESC LIMIT 10"
);
rows.forEach(r => {
  console.log(JSON.stringify({
    id: r.id,
    status: r.status,
    stripeMode: r.stripeMode,
    hasCustomer: !!r.stripeCustomerId,
    hasPaymentMethod: !!r.stripePaymentMethodId,
    hasDepositPI: !!r.depositPaymentIntentId,
    depositPI: r.depositPaymentIntentId ? r.depositPaymentIntentId.substring(0, 25) + "..." : null,
  }));
});
await conn.end();
