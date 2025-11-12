#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 PREPARANDO FRONTEND PARA NETLIFY...\n');

const setupNetlify = () => {
  try {
    // Verificar estructura
    const requiredFiles = [
      'package.json',
      'vite.config.js',
      'index.html',
      'src/main.jsx',
      'src/App.jsx'
    ];

    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      console.error('❌ Archivos faltantes:', missingFiles);
      return false;
    }

    console.log('✅ Estructura de proyecto OK');

    // Crear netlify.toml si no existe
    if (!fs.existsSync('netlify.toml')) {
      const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[headers]
  [headers."/*"]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"`;
      
      fs.writeFileSync('netlify.toml', netlifyConfig);
      console.log('✅ netlify.toml creado');
    }

    // Crear _redirects en public
    const publicDir = 'public';
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    const redirectsPath = path.join(publicDir, '_redirects');
    if (!fs.existsSync(redirectsPath)) {
      fs.writeFileSync(redirectsPath, '/*    /index.html   200');
      console.log('✅ _redirects creado');
    }

    // Verificar package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.scripts.build) {
      console.error('❌ Script build no encontrado en package.json');
      return false;
    }

    console.log('✅ Package.json verificado');

    console.log('\n🎉 FRONTEND LISTO PARA NETLIFY!');
    console.log('\n📋 PRÓXIMOS PASOS:');
    console.log('   1. Sube el proyecto a GitHub');
    console.log('   2. Conecta el repo en Netlify');
    console.log('   3. Configura:');
    console.log('      - Build command: npm run build');
    console.log('      - Publish directory: dist');
    console.log('   4. ¡Deploy automático!');

    return true;

  } catch (error) {
    console.error('❌ Error durante la preparación:', error.message);
    return false;
  }
};

setupNetlify();