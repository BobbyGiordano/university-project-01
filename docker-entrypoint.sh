#!/bin/sh
set -e

echo "=========================================================="
echo "🚀 Hex Titanium Bolt Specification Web System (Docker)"
echo "=========================================================="

echo "⏳ Checking database connection..."
MAX_RETRIES=30
COUNT=0
until node -e "
const net = require('net');
const client = net.createConnection({ host: 'postgres', port: 5432 }, () => {
  client.end();
  process.exit(0);
});
client.on('error', () => process.exit(1));
"; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX_RETRIES ]; then
    echo "❌ Database not reachable after $MAX_RETRIES seconds. Exiting."
    exit 1
  fi
  echo "Waiting for postgres database to be reachable ($COUNT/$MAX_RETRIES)..."
  sleep 1
done

echo "✅ Database connection established."

echo "🔄 Synchronizing database schema with Prisma db push..."
npx prisma db push --skip-generate

echo "🌱 Running database seeding..."
node prisma/seed.js || true

echo "=========================================================="
echo "🔌 Hex Titanium Backend Port: ${PORT:-3000}"
echo "🌐 UI accessible at: http://localhost:${PORT:-3000}"
echo "=========================================================="

exec "$@"
