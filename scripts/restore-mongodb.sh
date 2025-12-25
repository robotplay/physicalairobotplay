#!/bin/bash

###############################################################################
# MongoDB 복원 스크립트
# 용도: 백업 파일에서 MongoDB 복원
# 실행: ./scripts/restore-mongodb.sh [backup-file.tar.gz]
###############################################################################

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔄 MongoDB 복원 시작...${NC}"
echo ""

# MongoDB URI 확인
if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}❌ MONGODB_URI 환경 변수가 설정되지 않았습니다.${NC}"
    echo ""
    echo "환경 변수 설정 방법:"
    echo "  export MONGODB_URI='mongodb+srv://...'"
    echo ""
    exit 1
fi

# mongorestore 설치 확인
if ! command -v mongorestore &> /dev/null; then
    echo -e "${RED}❌ mongorestore가 설치되지 않았습니다.${NC}"
    echo ""
    echo "설치 방법:"
    echo "  brew install mongodb-database-tools"
    echo ""
    exit 1
fi

# 백업 파일 확인
BACKUP_ROOT="$HOME/mongodb-backups"

if [ -z "$1" ]; then
    echo -e "${YELLOW}📁 사용 가능한 백업 파일:${NC}"
    echo ""
    ls -lht "$BACKUP_ROOT"/*.tar.gz 2>/dev/null || echo "백업 파일이 없습니다."
    echo ""
    echo "사용법:"
    echo "  $0 [backup-file.tar.gz]"
    echo ""
    echo "예시:"
    echo "  $0 $BACKUP_ROOT/backup-20251226-140000.tar.gz"
    echo ""
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ 백업 파일을 찾을 수 없습니다: $BACKUP_FILE${NC}"
    exit 1
fi

# 확인 메시지
echo -e "${YELLOW}⚠️  경고: 이 작업은 현재 데이터베이스를 덮어씁니다!${NC}"
echo ""
echo "백업 파일: $BACKUP_FILE"
echo "대상 DB: $MONGODB_URI"
echo ""
read -p "계속하시겠습니까? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}❌ 복원이 취소되었습니다.${NC}"
    exit 0
fi

# 임시 디렉토리 생성
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# 압축 해제
echo -e "${GREEN}📦 압축 해제 중...${NC}"
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# 백업 디렉토리 찾기
RESTORE_DIR=$(find "$TEMP_DIR" -type d -name "backup-*" | head -1)

if [ -z "$RESTORE_DIR" ]; then
    echo -e "${RED}❌ 백업 디렉토리를 찾을 수 없습니다.${NC}"
    exit 1
fi

# 복원 실행
echo -e "${GREEN}🔄 복원 중...${NC}"
mongorestore --uri="$MONGODB_URI" --drop "$RESTORE_DIR"

# 결과
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 복원 완료!${NC}"
echo ""
echo "백업 파일: $BACKUP_FILE"
echo "복원 완료 시간: $(date)"
echo ""
echo "⚠️  중요: Vercel을 재배포하여 변경사항을 반영하세요!"
echo "  vercel --prod"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

