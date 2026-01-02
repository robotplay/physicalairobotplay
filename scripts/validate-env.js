#!/usr/bin/env node

/**
 * 환경 변수 검증 스크립트
 * 
 * 사용법:
 *   node scripts/validate-env.js
 * 
 * 또는 package.json에 추가:
 *   "scripts": {
 *     "validate-env": "node scripts/validate-env.js"
 *   }
 */

require('dotenv').config({ path: '.env.local' });

const { validateEnvVars, logEnvValidation } = require('../lib/env-validation.ts');

console.log('🔍 환경 변수 검증 중...\n');

const result = validateEnvVars();

logEnvValidation();

if (!result.isValid) {
    console.error('\n❌ 환경 변수 검증 실패!');
    console.error('누락된 필수 환경 변수를 설정해주세요.\n');
    process.exit(1);
} else {
    console.log('\n✅ 환경 변수 검증 완료!\n');
    process.exit(0);
}

