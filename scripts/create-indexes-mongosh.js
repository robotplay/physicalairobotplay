/**
 * MongoDB Shell 스크립트 (mongosh용)
 * 
 * 사용 방법:
 * 1. MongoDB Shell (mongosh) 실행
 * 2. 다음 명령어로 스크립트 실행:
 *    load('scripts/create-indexes-mongosh.js')
 * 
 * 또는 직접 복사하여 MongoDB Shell에 붙여넣기
 */

// 데이터베이스 선택
use('academy-site');

print('🚀 MongoDB 인덱스 생성 시작...\n');

// students 컬렉션
print('📋 students 컬렉션 인덱스 생성 중...');
try {
    db.students.createIndex({ studentId: 1 });
    print('  ✅ { studentId: 1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ studentId: 1, _id: 1 });
    print('  ✅ { studentId: 1, _id: 1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1, _id: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ parentPhone: 1 });
    print('  ✅ { parentPhone: 1 }');
} catch (e) {
    print('  ⚠️  { parentPhone: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ parentEmail: 1 });
    print('  ✅ { parentEmail: 1 }');
} catch (e) {
    print('  ⚠️  { parentEmail: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ name: 1 });
    print('  ✅ { name: 1 }');
} catch (e) {
    print('  ⚠️  { name: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ grade: 1 });
    print('  ✅ { grade: 1 }');
} catch (e) {
    print('  ⚠️  { grade: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ class: 1 });
    print('  ✅ { class: 1 }');
} catch (e) {
    print('  ⚠️  { class: 1 } - 이미 존재하거나 오류');
}

try {
    db.students.createIndex({ createdAt: -1 });
    print('  ✅ { createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { createdAt: -1 } - 이미 존재하거나 오류');
}

// attendance 컬렉션
print('\n📋 attendance 컬렉션 인덱스 생성 중...');
try {
    db.attendance.createIndex({ studentId: 1 });
    print('  ✅ { studentId: 1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1 } - 이미 존재하거나 오류');
}

try {
    db.attendance.createIndex({ studentId: 1, classDate: -1 });
    print('  ✅ { studentId: 1, classDate: -1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1, classDate: -1 } - 이미 존재하거나 오류');
}

try {
    db.attendance.createIndex({ classDate: -1 });
    print('  ✅ { classDate: -1 }');
} catch (e) {
    print('  ⚠️  { classDate: -1 } - 이미 존재하거나 오류');
}

try {
    db.attendance.createIndex({ studentClass: 1, classDate: -1 });
    print('  ✅ { studentClass: 1, classDate: -1 }');
} catch (e) {
    print('  ⚠️  { studentClass: 1, classDate: -1 } - 이미 존재하거나 오류');
}

try {
    db.attendance.createIndex({ studentId: 1, studentClass: 1, classDate: 1 });
    print('  ✅ { studentId: 1, studentClass: 1, classDate: 1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1, studentClass: 1, classDate: 1 } - 이미 존재하거나 오류');
}

// online_enrollments 컬렉션
print('\n📋 online_enrollments 컬렉션 인덱스 생성 중...');
try {
    db.online_enrollments.createIndex({ accessCode: 1 }, { unique: true });
    print('  ✅ { accessCode: 1 } (unique)');
} catch (e) {
    print('  ⚠️  { accessCode: 1 } (unique) - 이미 존재하거나 오류');
}

try {
    db.online_enrollments.createIndex({ email: 1 });
    print('  ✅ { email: 1 }');
} catch (e) {
    print('  ⚠️  { email: 1 } - 이미 존재하거나 오류');
}

try {
    db.online_enrollments.createIndex({ courseId: 1 });
    print('  ✅ { courseId: 1 }');
} catch (e) {
    print('  ⚠️  { courseId: 1 } - 이미 존재하거나 오류');
}

try {
    db.online_enrollments.createIndex({ email: 1, courseId: 1 });
    print('  ✅ { email: 1, courseId: 1 }');
} catch (e) {
    print('  ⚠️  { email: 1, courseId: 1 } - 이미 존재하거나 오류');
}

try {
    db.online_enrollments.createIndex({ createdAt: -1 });
    print('  ✅ { createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { createdAt: -1 } - 이미 존재하거나 오류');
}

// news 컬렉션
print('\n📋 news 컬렉션 인덱스 생성 중...');
try {
    db.news.createIndex({ category: 1, createdAt: -1 });
    print('  ✅ { category: 1, createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { category: 1, createdAt: -1 } - 이미 존재하거나 오류');
}

try {
    db.news.createIndex({ createdAt: -1 });
    print('  ✅ { createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { createdAt: -1 } - 이미 존재하거나 오류');
}

try {
    db.news.createIndex({ isPublished: 1, createdAt: -1 });
    print('  ✅ { isPublished: 1, createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { isPublished: 1, createdAt: -1 } - 이미 존재하거나 오류');
}

// payments 컬렉션
print('\n📋 payments 컬렉션 인덱스 생성 중...');
try {
    db.payments.createIndex({ paymentId: 1 });
    print('  ✅ { paymentId: 1 }');
} catch (e) {
    print('  ⚠️  { paymentId: 1 } - 이미 존재하거나 오류');
}

try {
    db.payments.createIndex({ orderId: 1 });
    print('  ✅ { orderId: 1 }');
} catch (e) {
    print('  ⚠️  { orderId: 1 } - 이미 존재하거나 오류');
}

try {
    db.payments.createIndex({ customerEmail: 1 });
    print('  ✅ { customerEmail: 1 }');
} catch (e) {
    print('  ⚠️  { customerEmail: 1 } - 이미 존재하거나 오류');
}

try {
    db.payments.createIndex({ status: 1, timestamp: -1 });
    print('  ✅ { status: 1, timestamp: -1 }');
} catch (e) {
    print('  ⚠️  { status: 1, timestamp: -1 } - 이미 존재하거나 오류');
}

try {
    db.payments.createIndex({ timestamp: -1 });
    print('  ✅ { timestamp: -1 }');
} catch (e) {
    print('  ⚠️  { timestamp: -1 } - 이미 존재하거나 오류');
}

// faq 컬렉션
print('\n📋 faq 컬렉션 인덱스 생성 중...');
try {
    db.faq.createIndex({ category: 1, order: 1 });
    print('  ✅ { category: 1, order: 1 }');
} catch (e) {
    print('  ⚠️  { category: 1, order: 1 } - 이미 존재하거나 오류');
}

try {
    db.faq.createIndex({ isActive: 1, order: 1 });
    print('  ✅ { isActive: 1, order: 1 }');
} catch (e) {
    print('  ⚠️  { isActive: 1, order: 1 } - 이미 존재하거나 오류');
}

try {
    db.faq.createIndex({ order: 1 });
    print('  ✅ { order: 1 }');
} catch (e) {
    print('  ⚠️  { order: 1 } - 이미 존재하거나 오류');
}

// users 컬렉션
print('\n📋 users 컬렉션 인덱스 생성 중...');
try {
    db.users.createIndex({ username: 1 }, { unique: true });
    print('  ✅ { username: 1 } (unique)');
} catch (e) {
    print('  ⚠️  { username: 1 } (unique) - 이미 존재하거나 오류');
}

try {
    db.users.createIndex({ email: 1 });
    print('  ✅ { email: 1 }');
} catch (e) {
    print('  ⚠️  { email: 1 } - 이미 존재하거나 오류');
}

try {
    db.users.createIndex({ role: 1 });
    print('  ✅ { role: 1 }');
} catch (e) {
    print('  ⚠️  { role: 1 } - 이미 존재하거나 오류');
}

try {
    db.users.createIndex({ username: 1, role: 1 });
    print('  ✅ { username: 1, role: 1 }');
} catch (e) {
    print('  ⚠️  { username: 1, role: 1 } - 이미 존재하거나 오류');
}

// monthly_newsletters 컬렉션
print('\n📋 monthly_newsletters 컬렉션 인덱스 생성 중...');
try {
    db.monthly_newsletters.createIndex({ year: -1, month: -1 });
    print('  ✅ { year: -1, month: -1 }');
} catch (e) {
    print('  ⚠️  { year: -1, month: -1 } - 이미 존재하거나 오류');
}

try {
    db.monthly_newsletters.createIndex({ createdAt: -1 });
    print('  ✅ { createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { createdAt: -1 } - 이미 존재하거나 오류');
}

// student_feedback 컬렉션
print('\n📋 student_feedback 컬렉션 인덱스 생성 중...');
try {
    db.student_feedback.createIndex({ studentId: 1, date: -1 });
    print('  ✅ { studentId: 1, date: -1 }');
} catch (e) {
    print('  ⚠️  { studentId: 1, date: -1 } - 이미 존재하거나 오류');
}

try {
    db.student_feedback.createIndex({ date: -1 });
    print('  ✅ { date: -1 }');
} catch (e) {
    print('  ⚠️  { date: -1 } - 이미 존재하거나 오류');
}

// competitions 컬렉션
print('\n📋 competitions 컬렉션 인덱스 생성 중...');
try {
    db.competitions.createIndex({ year: -1, month: -1 });
    print('  ✅ { year: -1, month: -1 }');
} catch (e) {
    print('  ⚠️  { year: -1, month: -1 } - 이미 존재하거나 오류');
}

try {
    db.competitions.createIndex({ createdAt: -1 });
    print('  ✅ { createdAt: -1 }');
} catch (e) {
    print('  ⚠️  { createdAt: -1 } - 이미 존재하거나 오류');
}

print('\n✅ 모든 인덱스 생성 완료!');
print('\n📊 인덱스 확인:');
print('db.students.getIndexes()');
print('db.attendance.getIndexes()');
print('db.online_enrollments.getIndexes()');

