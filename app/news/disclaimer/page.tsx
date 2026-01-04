import Link from 'next/link';
import { ArrowLeft, Scale, FileText, ExternalLink } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-[#1A1A1A]">
            {/* Header */}
            <div className="bg-gradient-to-r from-deep-electric-blue/20 to-active-orange/20 border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-deep-electric-blue/10 rounded-full border border-deep-electric-blue/20 mb-4">
                            <Scale className="w-5 h-5 text-deep-electric-blue" />
                            <span className="text-sm text-deep-electric-blue font-semibold">
                                저작권 및 면책 조항
                            </span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Copyright & Disclaimer
                        </h1>
                        <p className="text-lg text-gray-300">
                            뉴스 수집 서비스 이용 안내
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12">
                <Link
                    href="/news/collected"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>뉴스 목록으로 돌아가기</span>
                </Link>

                <div className="bg-gray-800 rounded-2xl p-8 md:p-12 space-y-8">
                    {/* 1. 서비스 개요 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-deep-electric-blue" />
                            서비스 개요
                        </h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                본 웹사이트는 Physical AI Robot 및 로봇 교육 관련 정보를 제공하기 위해 
                                국내외 언론사의 공개 RSS 피드를 통해 기사 요약을 수집·제공합니다.
                            </p>
                            <p>
                                모든 콘텐츠는 <strong className="text-white">원저작권자에게 저작권이 있으며</strong>, 
                                본 사이트는 교육 및 정보 공유 목적으로 기사 요약만을 제공합니다.
                            </p>
                        </div>
                    </section>

                    {/* 2. 저작권 고지 */}
                    <section className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">저작권 고지</h2>
                        <div className="text-gray-300 space-y-3">
                            <ul className="list-disc list-inside space-y-2">
                                <li>본 사이트에 수집된 모든 기사의 저작권은 <strong className="text-white">원 언론사 및 저자</strong>에게 있습니다.</li>
                                <li>기사 <strong className="text-white">전문(全文)은 제공하지 않으며</strong>, 요약본(excerpt)만 표시합니다.</li>
                                <li>이미지는 원본 URL을 참조하며, <strong className="text-white">재호스팅하지 않습니다</strong>.</li>
                                <li>모든 기사에는 <strong className="text-white">출처와 원문 링크</strong>가 명시되어 있습니다.</li>
                                <li>전체 기사는 반드시 <strong className="text-white">원문 사이트</strong>에서 확인해 주세요.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 3. RSS 피드 출처 */}
                    <section className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">RSS 피드 출처</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>본 사이트는 다음 언론사의 공개 RSS 피드를 사용합니다:</p>
                            
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2">국내 언론사</h3>
                                    <ul className="text-sm space-y-1">
                                        <li>• 연합뉴스 (yna.co.kr)</li>
                                        <li>• ZDNet (zdnet.co.kr)</li>
                                        <li>• 전자신문 (etnews.com)</li>
                                        <li>• 로봇신문 (irobotnews.com)</li>
                                        <li>• 디지털타임스 (dt.co.kr)</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-700/50 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2">해외 매체</h3>
                                    <ul className="text-sm space-y-1">
                                        <li>• IEEE Spectrum</li>
                                        <li>• TechCrunch</li>
                                        <li>• VentureBeat</li>
                                        <li>• MIT Technology Review</li>
                                        <li>• The Verge, Wired, 외</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 4. 면책 조항 */}
                    <section className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">면책 조항</h2>
                        <div className="text-gray-300 space-y-3">
                            <ul className="list-disc list-inside space-y-2">
                                <li>본 사이트는 비영리 교육 목적으로 운영됩니다.</li>
                                <li>수집된 정보의 정확성, 완전성, 적시성에 대해 보증하지 않습니다.</li>
                                <li>기사 내용에 대한 책임은 원 저작권자에게 있습니다.</li>
                                <li>링크된 외부 사이트의 내용에 대해서는 책임지지 않습니다.</li>
                                <li>저작권자의 요청이 있을 경우 즉시 해당 콘텐츠를 삭제합니다.</li>
                            </ul>
                        </div>
                    </section>

                    {/* 5. 저작권 침해 신고 */}
                    <section className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">저작권 침해 신고</h2>
                        <div className="bg-deep-electric-blue/10 border border-deep-electric-blue/20 rounded-lg p-6">
                            <p className="text-gray-300 mb-4">
                                본 사이트에 게재된 콘텐츠가 귀하의 저작권을 침해한다고 판단되는 경우, 
                                아래 연락처로 신고해 주시기 바랍니다.
                            </p>
                            <div className="text-white font-semibold">
                                <p>📧 이메일: copyright@parplay.co.kr</p>
                                <p className="text-sm text-gray-400 mt-2">
                                    * 신고 접수 후 24시간 이내에 해당 콘텐츠를 삭제 처리합니다.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 6. 공정 이용 (Fair Use) */}
                    <section className="border-t border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-4">공정 이용 원칙</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                본 사이트는 저작권법 제28조(공표된 저작물의 인용)에 따라 
                                다음과 같은 원칙을 준수합니다:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>보도, 비평, 교육, 연구 등을 위한 정당한 범위 내 인용</li>
                                <li>출처 명시 및 원문 링크 제공</li>
                                <li>요약본만 제공하여 원저작물의 시장 가치를 해치지 않음</li>
                                <li>비영리 교육 목적의 이용</li>
                            </ul>
                        </div>
                    </section>

                    {/* 원문 보기 버튼 */}
                    <div className="border-t border-gray-700 pt-8">
                        <Link
                            href="/news/collected"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-electric-blue text-white rounded-lg hover:bg-deep-electric-blue/80 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5" />
                            뉴스 목록으로 이동
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

