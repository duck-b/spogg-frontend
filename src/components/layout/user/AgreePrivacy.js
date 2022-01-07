import React from 'react';

const AgreePrivacy = (props) => {
    return(
        <div className="agreeDocument">
            <h3>개인정보 처리 방침</h3>
            <p>주식회사 핏데이터 (‘<a onClick={() => window.open('http://fitdata.co.kr')}>http://fitdata.co.kr</a>’이하 “회사”라 합니다)는 회사가 제공하는 스포지지 서비스(‘<a onClick={() => window.open('http://m.spo.gg')}>http://m.spo.gg</a>’이하 “서비스"라 합니다.)는 회원의 개인정보보호를 매우 중요시하며, 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』 등 개인정보와 관련된 법령 상의 개인정보보호규정을 준수하고 있습니다.<br/>
            회사는 아래와 같이 개인정보 처리 방침을 명시하여 회원이 회사에 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치를 취하는지 알려드립니다.<br/>
            회사의 서비스 개인정보 처리 방침은 정부의 법률 및 지침의 변경과 당사의 약관 및 내부 정책에 따라 변경될 수 있으며 이를 개정하는 경우 회사는 변경사항에 대하여 즉시 서비스 화면에 게시합니다.<br/>
            회원님께서는 사이트 방문 시 수시로 확인하시기 바랍니다.
            </p>
            <h4>1. 스포지지는 이용하는 서비스의 형태에 따라 다음과 같은 개인정보 수집 및 이용∙제공∙파기하고 있습니다.</h4>
            <p>① 개인정보 수집 ⋅ 이용 목적 및 항목</p>
            <p>회사가 제공하는 서비스는 별도의 회원가입 절차 없이 자유롭게 콘텐츠에 접근할 수 있습니다. 회사의 회원제 서비스 이용을 위해 수집 ⋅ 이용하는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 목적 변경 시 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>
            <div className="tables">
                <table>
                    <tr>
                        <th>수집방법</th>
                        <th>수집항목</th>
                        <th>수집 및 이용목적</th>
                        <th>보유 및 이용기간</th>
                    </tr>
                    <tr>
                        <td>회원가입(필수)</td>
                        <td>닉네임, 이메일 주소, 성별, 생년월일, 스포츠 관심사, 프로필사진, 구글, 카카오톡, 네이버 사용자 ID</td>
                        <td>서비스 이용 및 상담을 위한 이용자 식별, 마케팅 및 서비스 개선을 위한 분석 등</td>
                        <td>회원탈퇴 및 목적달성 후 지체없이 삭제합니다.<br/><br/>
                        단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령의 규정에 따라 거래 관계 확인을 위해 개인정보를 일정기간 보유 할 수 있습니다.<br/><br/>
                        또한 회원에서 탈퇴한 후 회원 재가입, 임의해지 등을 반복적으로 행하여 회사가 제공하는 할인쿠폰, 이벤트 혜택 등으로 경제상의 이익을 취하는 것을 방지 하고자 회원 탈퇴 후에도 구매 인증 시 입력한 정보는 6개월 동안 보관합니다.</td>
                    </tr>
                    <tr>
                        <td>인포머 회원<br/><br/>신청 및 서비스 제공</td>
                        <td>(필수)이름, 아이디(이메일), 비밀번호, 휴대전화번호, 지역, 자격증, (선택)개인 홈페이지, 보유 SNS</td>
                        <td>이용자 식별, 본인여부 확인, 상품 배송 및 계약이행</td>
                        <td rowSpan={4}>목적 달성 후 파기합니다.<br/><br/>단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법령의 규정에 따라 거래 관계 확인을 위해 개인정보를 일정기간 보유 할 수 있습니다.</td>
                    </tr>
                    <tr>
                        <td>고객센터 서비스 제공</td>
                        <td>이름, 스포지지 닉네임, 생년월일, 휴대전화번호, 등</td>
                        <td>스포지지 서비스 이용 고객 상담</td>
                    </tr>
                    <tr>
                        <td>이벤트 참여</td>
                        <td>스포지지 닉네임 및, 소셜미디어 아이디<br/><br/>※ 이벤트 참여 회원이라 함은 스포지지에서 운영하는 소셜미디어(페이스북, 인스타그램, 블로그 등) 및 스포지지 사이트 및 앱 등을 통하여 진행하는 이벤트에 참여한 회원을 의미합니다.</td>
                        <td>이벤트 참여자 식별 및 당첨자 선정</td>
                    </tr>
                    <tr>
                        <td>이벤트 당첨</td>
                        <td>이름, 휴대전화 번호, 이메일 주소, 주소</td>
                        <td>이벤트 당첨에 따른 경품 전달</td>
                    </tr>
                </table>
            </div>
            <p>② 개인정보 수집방법</p>
            <p>1) 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우, 해당 개인정보를 수집합니다.<br/>
            2) 고객센터를 통한 상담 과정에서 웹 페이지, 메일, 팩스, 전화 등을 통해 이용자의 개인정보가 수집될 수 있습니다.<br/>
            3) 회사와 제휴한 외부 기업이나 단체로부터 개인정보를 제공받을 수 있으며, 이러한 경우에는 제휴사에서 이용자에게 개인정보 제공 동의를 받은 후 수집합니다.<br/>
            </p>
            <p>③ 개인정보 보유 ⋅ 이용 기간</p>
            <p>1) 회사는 이용자로부터 개인정보 수집 시에 동의 받은 보유 ⋅ 이용기간 내에서 개인정보를 처리⋅보유합니다.<br/>
                &nbsp;- 회원 정보 : 회원탈퇴 후 15일 까지 <br/>
                &nbsp;- 비회원 정보 : 업무 목적 달성 시까지<br/>
                &nbsp;- 서비스 이용에 따른 채권⋅채무관계 정산 시까지<br/>
                2) 1 년 간 회원의 서비스 이용 기록이 없는 경우,  『정보통신망 이용촉진 및 정보보호등에 관한 법률』 제 29 조에 근거하여 회원에게 사전 통지하고, 별도 보관합니다. <br/>
                3) 회원에서 탈퇴한 후 재가입, 임의해지 등을 반복적으로 행하여 회사가 제공하는 할인쿠폰, 이벤트 혜택 등으로 경제상의 이익을 취하거나 이 과정에서 명의를 무단으로 상용하는 편법과 불법행위를 하는 회원을 차단하고자 회원 탈퇴 후 6개월 동안 보관합니다.<br/>
                4) 단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관련 법정의 규정에 따라 거래 관계 확인을 위해 개인정보를 일정기간 보유 할 수 있습니다.
            </p>
            <div className="tables tables_mini">
                <table>
                    <tr>
                        <th>법령</th>
                        <th>항목</th>
                        <th>기간</th>
                    </tr>
                    <tr>
                        <td rowSpan={3}>전자상거래 등에서의 소비자보호에 관한 법률</td>
                        <td>계약 또는 청약철회 등에 관한 기록</td>
                        <td>5년</td>
                    </tr>
                    <tr>
                        <td>대금결제 및 재화 등의 공급에 관한 기록</td>
                        <td>5년</td>
                    </tr>
                    <tr>
                        <td>소비자의 불만 또는 분쟁 처리에 관한 기록</td>
                        <td>3년</td>
                    </tr>
                    <tr>
                        <td>위치정보의 보호 및 이용 등에 관한 법률</td>
                        <td>개인위치정보에 관한 기록</td>
                        <td>6개월</td>
                    </tr>
                    <tr>
                        <td>전자금융거래법</td>
                        <td>전자금융 거래에 관한 기록</td>
                        <td>5년</td>
                    </tr>
                    <tr>
                        <td>통신비밀보호법</td>
                        <td>서비스 이용 관련 개인정보(로그기록)</td>
                        <td>3개월</td>
                    </tr>
                </table>
            </div>
            <h4>2. 서비스의 제공또는 법령에 정해진 책임의 준수를 위하여 회사가 보관하고 있는 개인정보가 제 3자에게 수집 목적 범위 내에서 제공 될 수 있습니다.</h4>
            <p>① 회사는 이용자의 개인정보를 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 규정에 해당하는 경우에만 개인정보를 제 3자에게 제공합니다.<br/>
            ② 회사는 다음과 같이 개인정보를 제 3자에게 제공하고 있습니다.<br/>
            </p>
            <div className="tables">
                <table>
                    <tr>
                        <th>제공받는 자</th>
                        <th>제공목적</th>
                        <th>제공하는 개인정보 항목</th>
                        <th>개인정보 보유 및 이용기간</th>
                    </tr>
                    <tr>
                        <td>인포머</td>
                        <td>상품 및 경품(서비스)배송(전송), 제품 설치, 반품, 환불, 고객상담 등 정보통신서비스제공계약 및 전자상거래(통신판매)계약의 이행을 위해 필요한 업무의 처리</td>
                        <td>1) 접속 IP정보<br/>
                        2) 쿠키<br/>
                        3) 접속로그<br/>
                        4) 서비스 이용기록<br/>
                        5) 이용제한 기록 등</td>
                        <td>서비스 제공 목적 달성시 까지<br/>단, 관계 법령이 정한 시점까지 보존</td>
                    </tr>
                </table>
            </div>
            <h4>3. 회사는 서비스 향상과 효과적인 업무처리를 위하여 다음과 같이 개인정보를 처리 위탁하고 있습니다.</h4>
            <p>① 회사는 원할하고 향상된 서비스를 위하여 개인정보 처리를 타인에게 위탁할 수 있습니다. 이 경우 회사는 사전에 다음 각 호의 사항 모두를 이용자에게 미리 알리고 동의를 받습니다.<br/>
            (1) 개인정보 처리위탁을 받는 자<br/>
            (2) 개인정보 처리위탁을 하는 업무의 내용<br/>
            ② 회사는 개인정보의 처리와 관련하여 아래와 같이 업무를 위탁하고 있으며, 관계법령에 따라 위탁 계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 조치를 하고 있습니다. 회사는 위탁 계약 시 수탁자의 개인정보 보호조치 능력을 고려하고, 개인정보의 안전한 관리 및 파기 등 수탁자의 의무 이행 여부를 주기적으로 확인합니다. 또한 위탁처리하는 정보는 원활한 서비스를 제공하기 위하여 필요한 최소한의 정보에 국한됩니다.
            </p>
            <div className="tables tables_mini">
                <table>
                    <tr>
                        <th>제공받는 자</th>
                        <th>제공목적</th>
                        <th>보유 및 이용기간</th>
                    </tr>
                    <tr>
                        <td>Amazon Web Services<br/>(AWS KOREA)</td>
                        <td>클라우드 IT인프라 제공</td>
                        <td>회원탈퇴 시 혹은 위탁계약 종료 및 서비스 종료 시까지 (이용자가 해당 서비스를 이용하는 경우에만 처리 위탁됨)</td>
                    </tr>
                </table>
            </div>
            <h4>5. 이용자 및 법정대리인은 아래와 같은 권리를 행사할 수 있습니다.</h4>
            <p>① 이용자 및 법정대리인은 언제든지 수집 정보에 대하여 수정, 동의철회, 삭제 등을 요청하실 수 있습니다. 다만, 동의 철회․삭제시 서비스의 일부 또는 전부 이용이 제한될 수 있습니다.<br/>
            ② (조회/수정 및 정정) 홈페이지에서 ‘더보기&gt;마이페이지&gt;회원정보수정’ 메뉴 또는 1:1 상담(카카오채널 “스포지지")을 이용하여 처리할 수 있습니다. 처리가 완료될 때까지 해당 정보를 이용하거나 타인에게 제공하지 않을 것입니다. 또한 합리적인 사유로 잘못된 개인정보를 제3자에게 이미 제공한 경우, 정정 처리의 결과를 지체 없이 제3자에게 통지하여 정정하도록 조치합니다.<br/>
            ③ (동의 철회/삭제) 1:1 상담(카카오채널 “스포지지”)을 이용하여 수집 정보에 대한 동의 철회 및 삭제를 요청하실 수 있습니다. 다만, 수집정보에 대한 동의 철회․삭제시 서비스의 일부 또는 전부 이용이 제한될 수 있으며, 다른 법령에 따라 수집하는 정보의 경우에는 동의 철회가 어려울 수 있습니다.<br/>
            ④ (회원 탈퇴) 홈페이지의 ‘더보기&gt;마이페이지&gt;회원정보수정&gt;회원탈퇴’ 메뉴를 이용하여 편리하게 직접 탈퇴를 진행하시거나, 1:1상담을 통하여 진행할 수 있습니다.<br/>
            ⑤ (서비스 재이용) 탈퇴후 동일한 계정으로 로그인 시도시 15일 이전일 경우 “복구”여부를 확인 할 수 있으며, 계정 재이용이 가능합니다. 만약 15일 이후일 경우 동일한 계정으로 다시 회원가입 절차를 통해 서비스 이용이 가능합니다. 고객센터 010-2239-6702을 이용하시기 바랍니다.<br/>
            ⑥ (상담/문의) 회사는 개인정보의 수집 및 이용 목적에 따라 이용자와 상담원 간의 통화내용을 녹음할 수 있으며 고객센터를 통한 소비자 상담/문의 시 녹음 등에 대한 안내는 고객센터 상담 전 안내 멘트를 통해 확인하실 수 있습니다.
            </p>
            <h4>6. 자동 수집되는 개인정보 및 거부에 관한 사항은 다음과 같습니다.</h4>
            <p>회사는 이용자의 정보를 수시로 저장하고 찾아내는 쿠키(cookie) 등을 운용합니다. 쿠키는 웹사이트가 이용자의 컴퓨터 브라우저에 보내는 아주 작은 텍스트 파일로 이용자의 컴퓨터 하드디스크에 저장됩니다.<br/><br/>
            ① 쿠키의 사용 목적<br/>
            &nbsp;- 회원과 비회원의 접속 빈도나 방문 시간 등의 분석, 이용 형태 및 관심분야 파악, 자취, 추적, 각종 이벤트 참여 정도, 방문 횟수 파악 등을 통한 타겟 마케팅 등 개인별 맞춤 서비스를 제공하기 위해 쿠키를 사용합니다.<br/><br/>
            ② 쿠키의 설치, 운영과 거부<br/>
            &nbsp;- 이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 언제든지 이러한 쿠키의 저장을 거부하거나 삭제할 수 있습니다.<br/>
            &nbsp;- 쿠키의 설정은 웹브라우저별 옵션 선택을 통해 ①모든 쿠키를 허용, ②쿠키가 저장될 때 마다 확인<br/><br/>
            ③모든 쿠키의 저장을 저장을 거부 할 수 있습니다.<br/>
            &nbsp;- 이러한 쿠키의 설정 방법은 웹브라우저에 따라 차이가 있으므로, 자세한 사항은 각 브라우저별 도움말을 참고해 주시기 바랍니다.<br/>
            &nbsp;- Internet Explorer : 도구 메뉴 선택 &gt; 인터넷 옵션 선택 &gt; 개인정보 탭 클릭 &gt; 개인정보처리 수준 설정<br/>
            &nbsp;- Chrome : 설정 메뉴 선택 &gt; 고급 설정 표시 선택 &gt; 개인정보-콘텐츠 설정 선택 &gt; 쿠키 수준 설정<br/>
            &nbsp;- firefox : 옵션 메뉴 선택 &gt; 개인정보 선택 &gt; 방문기록-사용자 정의 설정 &gt; 쿠키 수준 설정<br/>
            &nbsp;- safari : 환경설정 메뉴 선택 &gt; 개인정보 탭 선택 &gt; 쿠키 및 웹 사이트 데이터 수준 설정<br/>
            &nbsp;- 단, 쿠키의 저장을 거부하였을 경우에는 로그인이 필요한 서비스 등 일부 서비스 이용에 어려움이 있을 수 있습니다.<br/><br/>
            ④모든 쿠키의 저장을 저장을 거부 할 수 있습니다.<br/>
            &nbsp;- 회사는 구글(Google)에서 제공하는 웹 분석 도구인 구글 애널리틱스를 이용하고 있으며, 이 경우 이용자 개인을 식별할 수 없도록 비식별화 처리된 정보를 이용합니다. 이용자는 구글 애널리틱스 Opt-out Browser Add-on 을 이용하거나, 쿠키 설정 거부를 통해 구글 애널리틱스 이용을 거부할 수 있습니다.</p>
            <h4>7. 맞춤형 광고</h4>
            <p>고객에서 맞춤형 광고에 제공하기 위하여 회사는 웹 브라우저에서는 ‘쿠키' , 모바일 앱에서는 광고식별자(ADID)를  수집하여 사용합니다. 회사는 쿠키 및 광고식별자를 통해 고객의 서비스 사용 이력을 자동으로 수집하고 이를 활용하여 고객 맞춤 광고를 진행합니다. 회사에서 수집하는 쿠키 및 광고식별자는 다른 개인정보와 연계되지 않으며 개인을 식별하지 않습니다.<br/><br/>
            사용자는 언제든지 이러한 맞춤형 광고 수신을 거부할 수 있습니다.</p>
            <h4>8. 회사는 이용자들의 개인정보를 처리함에 있어 개인정보의 기술적/관리적 보호 대책을 마련하여 정보보호를 위해 노력하고 있습니다.</h4>
            <p>회사는 이용자들의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출, 변조 또는 훼손되지 않도록 안정성 확보를 위하여 다음과 같은 기술적/관리적 보호대책을 강구하고 있습니다.<br/><br/>
            ① 해킹 등에 대비한 대책<br/>
            &nbsp;- 개인정보의 훼손 피해에 대비하여 중요한 데이터를 주기적으로 백업하고 있으며, 백신 프로그램을 이용하여 개인정보나 중요한 데이터의 유출 방지를 위해 노력하고 있습니다.<br/>
            &nbsp;- 민감한 개인정보는 정보통신망을 통해 주고받는 과정에서 암호화 통신을 적용하여 개인정보를 안전하게 전송할 수 있도록 하고 있습니다.<br/>
            &nbsp;- 이 외에도 보안 시스템 도입 및 전문인력 확충 등 보안성 확보를 위해 지속적으로 노력하고 있습니다. <br/><br/>
            ② 개인정보 처리자의 최소화 및 주기적인 교육<br/>
            &nbsp;- 회사의 개인정보 관련 처리자는 담당자로 한정하여 개인정보 처리자를 최소화 하고 있으며, 퇴직 및 직무변경 등 인사이동이 있는 경우 지체 없이 권한을 변경, 말소 하여 개인정보 접근 권한을 통제 하고 있습니다.<br/>
            &nbsp;- 개인정보 처리자에 대해 주기적으로 교육을 진행하여 개인정보보호의 중요성을 인식시키고, 안전하게 관리 할 수 있도록 최선의 노력을 다하고 있습니다.</p>
            <h4>9. 이용자의 의무</h4>
            <p>① 이용자는 본인의 개인정보를 안전하게 지키기 위해 개인정보보호에 관한 법률을 준수할 의무가 있습니다.<br/>
            ② 이용자는 자신의 개인정보를 안전하게 보호할 의무가 있으며, 회사는 이용자 개인의 부주의로 인해 발생된 일에 대해서는 책임을 지지 않습니다. 따라서 이용자는 자신의 개인정보보호를 위하여 SNS ID 및 비밀번호를 철저히 관리하고 주기적으로 변경하는 등의 최선의 노력을 다할 의무가 있습니다.<br/>
            ③ 이용자는 본인의 개인정보를 최신의 상태로 정확하게 입력하고 유지할 의무가 있습니다. 이용자의 부정확한 정보 입력으로 인하여 발생하는 문제의 책임은 이용자 본인에게 있습니다.<br/>
            ④ 이용자는 타인의 개인정보를 도용하여 회원가입 또는 서비스 이용 시 회원자격 상실과 함께 개인정보에 관한 법률에 의거하여 처벌될 수 있습니다.<br/>
            ⑤ 이용자는 타인의 개인정보를 침해하거나 유출하지 않을 의무도 가지고 있습니다. 서비스 이용 중 다른 이용자에 대해 알게 된 개인정보를 언급하거나, 유출할 경우 개인정보 관련 법령에 의거하여 처벌될 수 있습니다.<br/>
            </p>
            <h4>10. 스포지지는 귀하의 안전한 개인정보 보호를 위해 개인정보 보호책임자를 지정하고 있습니다.</h4>
            <p>① 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="tables tables_mini"> 
                <table>
                    <tr>
                        <th>개인정보보호책임자</th>
                        <th>개인정보 민원처리 담당부서</th>
                    </tr>
                    <tr>
                        <td>성명 : 최 재형<br/>
                        직책 : 개발 / 직급 : 이사<br/>
                        연락처 : 010 - 8366 - 1742<br/>
                        fdeer814@spo.gg</td>
                        <td>부서명 : 고객센터<br/>
                        연락처 : 010 - 2239 - 6702<br/>
                        info@spo.gg</td>
                    </tr>
                </table>
            </div>
            <p>② 회사가 제공하는 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 고객지원센터로 문의하실 수 있으며, (주)핏데이터는 이런 문의에 대해 지체 없이 답변 및 처리 할 것입니다.<br/>
            ③ 개인정보가 침해 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.<br/>
            ▶ 개인정보 침해신고센터 (한국인터넷진흥원 운영) : (국번없이) 118 / privacy.kisa.or.krv<br/>
            ▶ 대검찰청 사이버범죄수사단 : (국번없이) 1301 / www.spo.go.kr<br/>
            ▶ 경찰청 사이버안전국 : (국번없이) 182 / www.cyber.go.kr <br/>
            ▶ 전자거래분쟁조정위원회 (https://www.ecmc.or.kr / 1661-5714)<br/>
            </p>
            <h4>11. 개인정보 처리방침 변경에 관한 정책 시행 및 공고</h4>
            <p>본 개인정보취급방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다. 또한 관련 법령이나 회사 정책의 변경으로 불가피하게 처리방침을 변경해야 하는 경우, 웹사이트 공지사항을 통해 빠르게 알려드리고 있으니 참고하여 주시기 바랍니다.</p>
            <p>- 시행일 : 2021년 00월 08일(오픈일+7일)<br/>
                - 공고일 : 2021년 00월 01일(오픈일)
            </p>
        </div>
    )
}

export default AgreePrivacy;