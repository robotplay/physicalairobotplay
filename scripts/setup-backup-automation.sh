#!/bin/bash

###############################################################################
# MongoDB 백업 자동화 설정 스크립트
# 용도: cron을 사용하여 주간 자동 백업 설정
# 실행: ./scripts/setup-backup-automation.sh
###############################################################################

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🤖 MongoDB 백업 자동화 설정 시작...${NC}"
echo ""

# 현재 스크립트 경로
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-mongodb.sh"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 백업 스크립트 존재 확인
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo -e "${RED}❌ 백업 스크립트를 찾을 수 없습니다: $BACKUP_SCRIPT${NC}"
    exit 1
fi

# 실행 권한 확인
if [ ! -x "$BACKUP_SCRIPT" ]; then
    echo -e "${YELLOW}⚠️  실행 권한 추가 중...${NC}"
    chmod +x "$BACKUP_SCRIPT"
fi

# .env.local 확인
ENV_FILE="$PROJECT_ROOT/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  .env.local 파일이 없습니다.${NC}"
    echo "생성 중..."
    touch "$ENV_FILE"
fi

# MONGODB_URI 확인
if ! grep -q "MONGODB_URI" "$ENV_FILE"; then
    echo ""
    echo -e "${YELLOW}⚠️  MONGODB_URI가 .env.local에 없습니다.${NC}"
    echo ""
    echo "1. Vercel 대시보드에서 MONGODB_URI 복사:"
    echo "   https://vercel.com/[your-team]/physicalairobotplay/settings/environment-variables"
    echo ""
    echo "2. 아래에 붙여넣으세요 (또는 나중에 .env.local에 직접 추가):"
    read -p "MONGODB_URI (Enter를 눌러 건너뛰기): " mongodb_uri
    
    if [ -n "$mongodb_uri" ]; then
        echo "MONGODB_URI=$mongodb_uri" >> "$ENV_FILE"
        echo -e "${GREEN}✅ MONGODB_URI가 .env.local에 추가되었습니다.${NC}"
    else
        echo -e "${YELLOW}⚠️  나중에 .env.local에 수동으로 추가하세요:${NC}"
        echo "   MONGODB_URI=mongodb+srv://..."
    fi
fi

# 래퍼 스크립트 생성 (환경 변수 로드용)
WRAPPER_SCRIPT="$SCRIPT_DIR/backup-wrapper.sh"
cat > "$WRAPPER_SCRIPT" << 'EOF'
#!/bin/bash
# 환경 변수 로드
if [ -f "$HOME/.cursor/worktrees/academy-site/hss/.env.local" ]; then
    export $(grep -v '^#' "$HOME/.cursor/worktrees/academy-site/hss/.env.local" | xargs)
fi

# 백업 스크립트 실행
"$HOME/.cursor/worktrees/academy-site/hss/scripts/backup-mongodb.sh"
EOF

chmod +x "$WRAPPER_SCRIPT"
echo -e "${GREEN}✅ 래퍼 스크립트 생성 완료${NC}"

# cron 작업 설정
echo ""
echo -e "${GREEN}📅 cron 작업 설정${NC}"
echo ""
echo "자동 백업 스케줄을 선택하세요:"
echo "  1) 매주 일요일 새벽 2시 (권장)"
echo "  2) 매일 새벽 2시"
echo "  3) 매주 월요일 새벽 2시"
echo "  4) 수동 설정 (직접 cron 표현식 입력)"
echo "  5) 건너뛰기 (나중에 수동 설정)"
echo ""
read -p "선택 (1-5): " choice

case $choice in
    1)
        CRON_SCHEDULE="0 2 * * 0"
        DESCRIPTION="매주 일요일 새벽 2시"
        ;;
    2)
        CRON_SCHEDULE="0 2 * * *"
        DESCRIPTION="매일 새벽 2시"
        ;;
    3)
        CRON_SCHEDULE="0 2 * * 1"
        DESCRIPTION="매주 월요일 새벽 2시"
        ;;
    4)
        echo "cron 표현식 입력 (예: 0 2 * * 0):"
        read -p "> " CRON_SCHEDULE
        DESCRIPTION="사용자 지정"
        ;;
    5)
        echo -e "${YELLOW}⚠️  cron 설정을 건너뜁니다.${NC}"
        echo ""
        echo "나중에 수동으로 설정하려면:"
        echo "  1. crontab -e"
        echo "  2. 아래 라인 추가:"
        echo "     $CRON_SCHEDULE $WRAPPER_SCRIPT >> $HOME/mongodb-backup.log 2>&1"
        echo ""
        exit 0
        ;;
    *)
        echo -e "${RED}❌ 잘못된 선택입니다.${NC}"
        exit 1
        ;;
esac

# cron 작업 추가
CRON_JOB="$CRON_SCHEDULE $WRAPPER_SCRIPT >> $HOME/mongodb-backup.log 2>&1"
CRON_COMMENT="# MongoDB 자동 백업 - $DESCRIPTION"

# 기존 cron 작업 확인
if crontab -l 2>/dev/null | grep -q "backup-wrapper.sh"; then
    echo -e "${YELLOW}⚠️  이미 백업 cron 작업이 존재합니다.${NC}"
    echo "기존 작업을 업데이트하시겠습니까? (y/n)"
    read -p "> " update_choice
    
    if [ "$update_choice" = "y" ]; then
        # 기존 작업 제거 후 새로 추가
        (crontab -l 2>/dev/null | grep -v "backup-wrapper.sh"; echo "$CRON_COMMENT"; echo "$CRON_JOB") | crontab -
        echo -e "${GREEN}✅ cron 작업이 업데이트되었습니다.${NC}"
    fi
else
    # 새 cron 작업 추가
    (crontab -l 2>/dev/null; echo ""; echo "$CRON_COMMENT"; echo "$CRON_JOB") | crontab -
    echo -e "${GREEN}✅ cron 작업이 추가되었습니다.${NC}"
fi

# 설정 확인
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 자동 백업 설정 완료!${NC}"
echo ""
echo "📅 스케줄: $DESCRIPTION"
echo "🗂️  백업 위치: $HOME/mongodb-backups/"
echo "📝 로그 파일: $HOME/mongodb-backup.log"
echo ""
echo "현재 cron 작업 확인:"
crontab -l | grep -A1 "MongoDB"
echo ""
echo "수동 백업 실행:"
echo "  $BACKUP_SCRIPT"
echo ""
echo "백업 로그 확인:"
echo "  tail -f $HOME/mongodb-backup.log"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

