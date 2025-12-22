#!/bin/bash

echo "🏠 Property Matching MVP - Quick Setup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js není nainstalován. Nainstalujte Node.js z https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Instaluji závislosti..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Chyba při instalaci závislostí"
    exit 1
fi

echo "✅ Závislosti nainstalovány"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  Soubor .env.local nebyl nalezen"
    echo "📝 Vytvářím .env.local z .env.example..."
    cp .env.example .env.local
    echo ""
    echo "⚠️  DŮLEŽITÉ: Vyplňte hodnoty v .env.local:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - ADMIN_KEY"
    echo ""
    echo "📖 Návod najdete v README.md"
    echo ""
else
    echo "✅ .env.local existuje"
fi

echo ""
echo "🎉 Setup dokončen!"
echo ""
echo "📋 Další kroky:"
echo "   1. Vytvořte Supabase projekt na https://supabase.com"
echo "   2. Spusťte SQL z schema.sql v SQL Editor"
echo "   3. Vytvořte storage bucket 'photos' (public)"
echo "   4. Vyplňte .env.local"
echo "   5. Spusťte: npm run dev"
echo ""
echo "📖 Více info v README.md"
