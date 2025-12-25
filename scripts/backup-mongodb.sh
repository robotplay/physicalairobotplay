#!/bin/bash

###############################################################################
# MongoDB 수동 백업 스크립트
# 용도: M0 Free Tier 클러스터 수동 백업
# 실행: ./scripts/backup-mongodb.sh
###############################################################################

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔄 MongoDB 백업 시작...${NC}"

# 날짜 및 시간
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_ROOT="$HOME/mongodb-backups"
BACKUP_DIR="$BACKUP_ROOT/backup-$DATE"

# 백업 디렉토리 생성
mkdir -p "$BACKUP_ROOT"

# MongoDB URI 확인
if [ -z "$MONGODB_URI" ]; then
    echo -e "${YELLOW}⚠️  MONGODB_URI 환경 변수가 설정되지 않았습니다.${NC}"
    echo ""
    echo "1. Vercel 대시보드에서 MONGODB_URI 복사:"
    echo "   https://vercel.com/[your-team]/physicalairobotplay/settings/environment-variables"
    echo ""
    echo "2. 터미널에서 실행:"
    echo "   export MONGODB_URI='mongodb+srv://...'"
    echo ""
    echo "3. 다시 스크립트 실행:"
    echo "   ./scripts/backup-mongodb.sh"
    echo ""
    exit 1
fi

# mongodump 설치 확인
if ! command -v mongodump &> /dev/null; then
    echo -e "${YELLOW}⚠️  mongodump가 설치되지 않았습니다.${NC}"
    echo ""
    echo "설치 방법:"
    echo "  brew install mongodb-database-tools"
    echo ""
    exit 1
fi

# 백업 실행
echo -e "${GREEN}📦 백업 중... (위치: $BACKUP_DIR)${NC}"
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR"

# 백업 크기 확인
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
echo -e "${GREEN}✅ 백업 완료! 크기: $BACKUP_SIZE${NC}"

# 압축
echo -e "${GREEN}🗜️  압축 중...${NC}"
cd "$BACKUP_ROOT"
tar -czf "backup-$DATE.tar.gz" "backup-$DATE"
COMPRESSED_SIZE=$(du -sh "backup-$DATE.tar.gz" | cut -f1)
echo -e "${GREEN}✅ 압축 완료! 크기: $COMPRESSED_SIZE${NC}"

# 원본 디렉토리 삭제
rm -rf "$BACKUP_DIR"

# Google Drive 업로드 (rclone 설정되어 있는 경우)
GDRIVE_UPLOADED=false
if command -v rclone &> /dev/null && rclone listremotes 2>/dev/null | grep -q "^gdrive:"; then
    echo -e "${GREEN}☁️  Google Drive 업로드 중...${NC}"
    
    if rclone copy "$BACKUP_ROOT/backup-$DATE.tar.gz" gdrive:mongodb-backups/ --progress 2>&1 | grep -v "Transferred:"; then
        echo -e "${GREEN}✅ Google Drive 업로드 완료!${NC}"
        GDRIVE_UPLOADED=true
    else
        echo -e "${YELLOW}⚠️  Google Drive 업로드 실패 (로컬 백업은 정상)${NC}"
    fi
else
    if ! command -v rclone &> /dev/null; then
        echo -e "${YELLOW}💡 rclone 미설치: Google Drive 업로드 건너뜀${NC}"
    elif ! rclone listremotes 2>/dev/null | grep -q "^gdrive:"; then
        echo -e "${YELLOW}💡 Google Drive 미설정: 업로드 건너뜀${NC}"
        echo "   설정: ./scripts/setup-gdrive.sh"
    fi
fi

# 30일 이상 된 백업 삭제
echo -e "${YELLOW}🧹 30일 이상 된 백업 정리 중...${NC}"
find "$BACKUP_ROOT" -name "backup-*.tar.gz" -mtime +30 -delete
REMAINING_BACKUPS=$(ls -1 "$BACKUP_ROOT"/backup-*.tar.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ 현재 백업 개수: $REMAINING_BACKUPS${NC}"

# 결과 요약
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 백업 완료!${NC}"
echo ""
echo "📁 로컬 백업: $BACKUP_ROOT/backup-$DATE.tar.gz"
echo "📊 압축 크기: $COMPRESSED_SIZE"
echo "📦 전체 백업: $REMAINING_BACKUPS개"

if [ "$GDRIVE_UPLOADED" = true ]; then
    echo "☁️  Google Drive: ✅ 업로드됨"
    echo "   위치: gdrive:mongodb-backups/backup-$DATE.tar.gz"
else
    echo "☁️  Google Drive: ⏭️  건너뜀"
fi

echo ""
echo "복원 방법:"
echo "  1. 압축 해제: tar -xzf backup-$DATE.tar.gz"
echo "  2. 복원 실행: mongorestore --uri=\"\$MONGODB_URI\" ./backup-$DATE"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

