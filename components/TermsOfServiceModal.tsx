'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface TermsOfServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="relative bg-[#1A1A1A] rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-[#1A1A1A] border-b border-gray-700 backdrop-blur-md z-20 px-6 sm:px-8 pt-6 pb-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            이용약관
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all z-10 group border border-gray-700 cursor-pointer"
                            aria-label="닫기"
                        >
                            <X className="w-5 h-5 text-gray-300 group-hover:text-white" />
                        </button>
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto max-h-[calc(90vh-100px)] px-6 sm:px-8 py-6">
                    <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
                        <p className="text-sm text-gray-400 mb-6">
                            주식회사 에이아이씨티(이하 '회사'라 한다)는 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 개인정보보호법, 통신판매업에서의 소비자 보호에 관한 법률 등 관련 법령을 준수하며, 관련 법령에 의거한 이용약관을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.
                        </p>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제1조 (목적)</h3>
                            <p>
                                이 약관은 주식회사 에이아이씨티(이하 "회사")가 운영하는 피지컬 AI 로봇플레이 웹사이트(이하 "사이트")에서 제공하는 온라인 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제2조 (정의)</h3>
                            <ol className="list-decimal list-inside space-y-2 ml-4 text-sm">
                                <li>"사이트"란 회사가 컴퓨터 등 정보통신설비를 이용하여 서비스를 제공할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이트를 운영하는 사업자의 의미로도 사용합니다.</li>
                                <li>"이용자"란 사이트에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                                <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
                                <li>"비회원"이란 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                                <li>"콘텐츠"란 사이트를 통해 제공되는 정보, 텍스트, 그래픽, 링크 등 모든 정보를 말합니다.</li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제3조 (약관의 게시와 개정)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 사이트 초기 화면에 게시합니다.
                                </li>
                                <li>
                                    회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
                                </li>
                                <li>
                                    회사가 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행약관과 함께 사이트의 초기화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다. 다만, 이용자에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다.
                                </li>
                                <li>
                                    이용자는 개정된 약관에 대해 거부할 권리가 있습니다. 이용자가 개정된 약관에 동의하지 않는 경우 이용자는 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제4조 (서비스의 제공 및 변경)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 다음과 같은 서비스를 제공합니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>로봇 코딩 교육 정보 제공</li>
                                        <li>온라인 강좌 신청 및 관리</li>
                                        <li>상담 문의 및 예약 서비스</li>
                                        <li>뉴스레터 구독 서비스</li>
                                        <li>기타 회사가 정하는 서비스</li>
                                    </ul>
                                </li>
                                <li>
                                    회사는 서비스의 내용을 변경할 수 있으며, 변경 시에는 사전에 공지합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제5조 (서비스의 중단)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                                </li>
                                <li>
                                    회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제6조 (회원가입)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.
                                </li>
                                <li>
                                    회사는 제1항과 같이 회원가입을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                                        <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                                        <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
                                    </ul>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제7조 (회원 탈퇴 및 자격 상실 등)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.
                                </li>
                                <li>
                                    회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                                        <li>다른 사람의 사이트 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                                        <li>사이트를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                                    </ul>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제8조 (회원에 대한 통지)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사가 회원에 대한 통지를 하는 경우, 회원이 회사에 제출한 전자우편 주소로 할 수 있습니다.
                                </li>
                                <li>
                                    회사는 불특정다수 회원에 대한 통지의 경우 1주일이상 사이트 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제9조 (구매신청 및 개인정보 제공 동의 등)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    사이트 이용자는 온라인 상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, 회사는 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>재화 등의 검색 및 선택</li>
                                        <li>성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력</li>
                                        <li>약관내용, 청약철회권이 제한되는 서비스, 배송료 등의 비용부담과 관련한 내용에 대한 확인</li>
                                        <li>이 약관에 동의하고 위 3호의 사항을 확인하거나 거부하는 표시</li>
                                    </ul>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제10조 (계약의 성립)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 제9조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>신청 내용에 허위, 기재누락, 오기가 있는 경우</li>
                                        <li>미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우</li>
                                        <li>기타 구매신청에 승낙하는 것이 회사 기술상 현저히 지장이 있다고 판단하는 경우</li>
                                    </ul>
                                </li>
                                <li>
                                    회사의 승낙이 제12조 제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제11조 (지급방법)</h3>
                            <p>
                                사이트에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각 호의 방법 중 가용한 방법으로 할 수 있습니다. 단, 회사는 이용자의 지급방법에 대하여 재화 등의 대금에 어떠한 명목의 수수료도 추가 징수할 수 없습니다.
                            </p>
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                <li>폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌이체</li>
                                <li>선불카드, 직불카드, 신용카드 등의 각종 카드 결제</li>
                                <li>온라인무통장입금</li>
                                <li>전자화폐에 의한 결제</li>
                                <li>수령 시 대금지급</li>
                                <li>마일리지 등 회사가 지급한 포인트에 의한 결제</li>
                                <li>회사와 계약을 맺었거나 회사가 인정한 상품권에 의한 결제</li>
                                <li>기타 전자적 지급 방법에 의한 대금 지급 등</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제12조 (수신확인통지·구매신청 변경 및 취소)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.
                                </li>
                                <li>
                                    수신확인통지를 받은 이용자는 의사표시의 불일치 등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 회사는 배송 전에 이용자의 요청이 있는 경우에는 지체 없이 그 요청에 따라 처리하여야 합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제13조 (재화 등의 공급)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문 제작, 포장 등 기타의 필요한 조치를 취합니다.
                                </li>
                                <li>
                                    회사는 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제14조 (환급)</h3>
                            <p>
                                회사는 이용자가 구매신청한 재화 또는 용역이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체 없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제15조 (청약철회 등)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사와 재화등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자 보호에 관한 법률」 제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다.
                                </li>
                                <li>
                                    이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.
                                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm text-gray-400">
                                        <li>이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우</li>
                                        <li>이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</li>
                                        <li>시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우</li>
                                        <li>같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우</li>
                                    </ul>
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제16조 (개인정보보호)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
                                </li>
                                <li>
                                    회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다.
                                </li>
                                <li>
                                    회사는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                                </li>
                                <li>
                                    회사는 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제17조 (회사의 의무)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화·용역을 제공하는데 최선을 다하여야 합니다.
                                </li>
                                <li>
                                    회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.
                                </li>
                                <li>
                                    회사가 상품이나 용역에 대하여 「표시·광고의 공정화에 관한 법률」 제3조 소정의 부당한 표시·광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제18조 (회원의 ID 및 비밀번호에 대한 의무)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
                                </li>
                                <li>
                                    회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
                                </li>
                                <li>
                                    회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 회사에 통보하고 회사의 안내가 있는 경우에는 그에 따라야 합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제19조 (이용자의 의무)</h3>
                            <p className="mb-3">이용자는 다음 행위를 하여서는 안 됩니다.</p>
                            <ol className="list-decimal list-inside space-y-2 ml-4 text-sm text-gray-400">
                                <li>신청 또는 변경시 허위 내용의 등록</li>
                                <li>타인의 정보 도용</li>
                                <li>회사가 게시한 정보의 변경</li>
                                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                                <li>회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                                <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 사이트에 공개 또는 게시하는 행위</li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제20조 (연결 "사이트"와 피연결 "사이트" 간의 관계)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    상위 사이트와 하위 사이트가 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결 "사이트"(웹 사이트)라고 하고 후자를 피연결 "사이트"(웹사이트)라고 합니다.
                                </li>
                                <li>
                                    연결 사이트는 피연결 사이트가 독자적으로 제공하는 재화 등에 의하여 이용자와 행하는 거래에 대해서 보증 책임을 지지 않는다는 뜻을 연결 사이트의 초기화면 또는 연결되는 시점의 팝업화면으로 명시한 경우에는 그 거래에 대한 보증 책임을 지지 않습니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제21조 (저작권의 귀속 및 이용제한)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
                                </li>
                                <li>
                                    이용자는 사이트를 이용함으로써 얻은 정보 중 회사에 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제22조 (분쟁해결)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
                                </li>
                                <li>
                                    회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">제23조 (재판권 및 준거법)</h3>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다.
                                </li>
                                <li>
                                    회사와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.
                                </li>
                            </ol>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-white mb-4">부칙</h3>
                            <p>이 약관은 2025년 1월 1일부터 시행됩니다.</p>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#1A1A1A] border-t border-gray-700 px-6 sm:px-8 py-4">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-deep-electric-blue to-active-orange hover:from-blue-700 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

