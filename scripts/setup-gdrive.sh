#!/bin/bash

###############################################################################
# Google Drive 연동 설정 스크립트
# 용도: rclone을 사용하여 Google Drive 연동
# 실행: ./scripts/setup-gdrive.sh
###############################################################################

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🔗 Google Drive 연동 설정${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# rclone 설치 확인
if ! command -v rclone &> /dev/null; then
    echo -e "${RED}❌ rclone이 설치되지 않았습니다.${NC}"
    echo ""
    echo "설치 방법:"
    echo "  brew install rclone"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ rclone 버전: $(rclone version | head -1)${NC}"
echo ""

# 기존 설정 확인
if rclone listremotes 2>/dev/null | grep -q "^gdrive:"; then
    echo -e "${YELLOW}⚠️  이미 'gdrive' 원격 저장소가 설정되어 있습니다.${NC}"
    echo ""
    rclone listremotes
    echo ""
    read -p "기존 설정을 삭제하고 다시 설정하시겠습니까? (y/n): " recreate
    
    if [ "$recreate" = "y" ]; then
        rclone config delete gdrive
        echo -e "${GREEN}✅ 기존 설정 삭제됨${NC}"
    else
        echo -e "${YELLOW}기존 설정을 유지합니다.${NC}"
        exit 0
    fi
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📝 Google Drive 설정 시작${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "다음 단계를 따라주세요:"
echo ""
echo "1. 'n' 입력 (새 원격 저장소)"
echo "2. 이름: gdrive"
echo "3. Storage: Google Drive 선택 (번호 입력)"
echo "4. Client ID: 엔터 (기본값 사용)"
echo "5. Client Secret: 엔터 (기본값 사용)"
echo "6. Scope: 1 (Full access) 선택"
echo "7. Root folder ID: 엔터"
echo "8. Service Account: 엔터"
echo "9. Advanced config: n"
echo "10. Auto config: y (브라우저 자동 열림)"
echo "11. 구글 계정으로 로그인 및 권한 허용"
echo "12. Configure as team drive: n"
echo "13. 설정 완료!"
echo ""
read -p "Enter를 눌러 계속..."

# rclone config 실행
rclone config

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Google Drive 연동 완료!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "설정 확인:"
rclone listremotes
echo ""
echo "연결 테스트:"
echo "  rclone lsd gdrive:"
echo ""
echo "백업 업로드 테스트:"
echo "  rclone copy ~/mongodb-backups/ gdrive:mongodb-backups/"
echo ""

