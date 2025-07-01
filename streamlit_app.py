# streamlit_app.py
import streamlit as st
import requests
import time
import os
from typing import Optional, Dict, Any

# Streamlit 페이지 설정
st.set_page_config(
    page_title="Deep Research - AI 보고서 생성",
    page_icon="🔍",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# 백엔드 서버 URL
BACKEND_URL = "http://localhost:3051"

class ResearchAPI:
    """백엔드 API와 통신하는 클래스"""
    
    @staticmethod
    def start_research(query: str, depth: int = 2, breadth: int = 5, solution_context: str = "") -> Optional[str]:
        """연구 시작"""
        try:
            response = requests.post(f"{BACKEND_URL}/api/research/start", json={
                "query": query,
                "depth": depth,
                "breadth": breadth,
                "solutionContext": solution_context or None
            }, timeout=30)
            
            if response.status_code == 200:
                return response.json().get('sessionId')
            else:
                st.error(f"연구 시작 실패: {response.json().get('error', 'Unknown error')}")
                return None
                
        except requests.exceptions.RequestException as e:
            st.error(f"서버 연결 실패: {str(e)}")
            return None
    
    @staticmethod
    def get_status(session_id: str) -> Optional[Dict[str, Any]]:
        """연구 진행상황 조회"""
        try:
            response = requests.get(f"{BACKEND_URL}/api/research/status/{session_id}", timeout=10)
            if response.status_code == 200:
                return response.json()
            return None
        except requests.exceptions.RequestException:
            return None
    
    @staticmethod
    def get_download_url(session_id: str, filename: str) -> str:
        """다운로드 URL 생성"""
        return f"{BACKEND_URL}/api/research/download/{session_id}/{filename}"

def main():
    # 메인 헤더
    st.title("🔍 Deep Research")
    st.subheader("AI가 생성하는 심층 기술 전략 보고서")
    st.markdown("---")
    
    # 세션 상태 초기화
    if 'session_id' not in st.session_state:
        st.session_state.session_id = None
    if 'research_status' not in st.session_state:
        st.session_state.research_status = None
    
    # 현재 상태에 따른 화면 표시
    if st.session_state.session_id is None:
        show_research_form()
    elif st.session_state.research_status in ['running']:
        show_progress_view()
    elif st.session_state.research_status == 'completed':
        show_results_view()
    elif st.session_state.research_status == 'error':
        show_error_view()

def show_research_form():
    """연구 시작 폼"""
    st.markdown("### 📝 연구 주제 입력")
    
    with st.form("research_form"):
        # 메인 쿼리 입력
        query = st.text_area(
            "연구하고 싶은 주제를 상세히 입력하세요",
            placeholder="예: 건설현장 안전관제용 시각AI기술",
            height=120,
            help="구체적이고 상세한 주제일수록 더 정확한 분석 결과를 얻을 수 있습니다."
        )
        
        # 솔루션 컨텍스트 (선택사항)
        solution_context = st.text_area(
            "분석할 IT 솔루션에 대한 추가 설명 (선택사항)",
            placeholder="예: 현재 개발 중인 솔루션의 특징이나 목표를 입력하세요",
            height=80
        )
        
        # 고급 설정
        with st.expander("⚙️ 고급 설정"):
            col1, col2 = st.columns(2)
            
            with col1:
                depth = st.slider(
                    "조사 깊이", 
                    min_value=1, 
                    max_value=3, 
                    value=2,
                    help="높을수록 더 세부적인 조사를 진행합니다 (소요시간 증가)"
                )
            
            with col2:
                breadth = st.slider(
                    "조사 너비", 
                    min_value=3, 
                    max_value=7, 
                    value=5,
                    help="한 단계에서 조사할 하위 주제의 개수"
                )
            
            st.info(f"예상 소요시간: {depth * breadth * 2}~{depth * breadth * 4}분")
        
        # 제출 버튼
        submitted = st.form_submit_button(
            "🚀 연구 시작", 
            type="primary",
            use_container_width=True
        )
        
        if submitted:
            if not query.strip():
                st.error("연구 주제를 입력해주세요.")
                return
            
            if len(query.strip()) < 10:
                st.error("더 구체적인 주제를 입력해주세요 (최소 10자 이상).")
                return
            
            # 연구 시작
            with st.spinner("연구를 시작하는 중..."):
                session_id = ResearchAPI.start_research(
                    query.strip(), 
                    depth, 
                    breadth, 
                    solution_context.strip()
                )
                
                if session_id:
                    st.session_state.session_id = session_id
                    st.session_state.research_status = 'running'
                    st.session_state.start_time = time.time()
                    st.rerun()

def show_progress_view():
    """연구 진행 상황 표시"""
    st.markdown("### 📊 연구 진행 중...")
    
    # 취소 버튼
    if st.button("❌ 연구 취소", type="secondary"):
        st.session_state.session_id = None
        st.session_state.research_status = None
        st.rerun()
    
    # 진행상황 placeholder
    progress_placeholder = st.empty()
    status_placeholder = st.empty()
    
    # 진행상황 폴링
    max_iterations = 300  # 최대 10분 (2초 * 300 = 600초)
    iteration = 0
    
    while st.session_state.research_status == 'running' and iteration < max_iterations:
        status = ResearchAPI.get_status(st.session_state.session_id)
        
        if not status:
            st.error("서버와의 연결이 끊어졌습니다.")
            break
        
        with progress_placeholder.container():
            # 전체 상태 확인
            if status['status'] == 'completed':
                st.session_state.research_status = 'completed'
                st.rerun()
            elif status['status'] == 'error':
                st.session_state.research_status = 'error'
                st.session_state.error_message = status.get('error', 'Unknown error')
                st.rerun()
            
            # 진행률 계산
            progress_data = status.get('progress', {})
            if progress_data:
                completed = progress_data.get('completedQueries', 0)
                total = progress_data.get('totalQueries', 1)
                progress_percent = completed / total if total > 0 else 0
                
                # 진행률 바
                st.progress(progress_percent)
                
                # 상세 정보
                col1, col2 = st.columns(2)
                with col1:
                    st.metric("진행률", f"{int(progress_percent * 100)}%")
                    st.metric("단계", f"{progress_data.get('currentDepth', 1)}/{progress_data.get('totalDepth', 2)}")
                
                with col2:
                    elapsed = int(time.time() - st.session_state.start_time)
                    st.metric("경과 시간", f"{elapsed // 60}분 {elapsed % 60}초")
                    st.metric("완료된 쿼리", f"{completed}/{total}")
                
                # 현재 작업
                current_query = progress_data.get('currentQuery', '')
                if current_query:
                    st.info(f"🔍 현재 작업: {current_query}")
            else:
                st.info("연구를 초기화하는 중...")
                st.progress(0)
        
        # 2초 대기
        time.sleep(2)
        iteration += 1
    
    # 타임아웃 처리
    if iteration >= max_iterations:
        st.error("연구가 예상보다 오래 걸리고 있습니다. 페이지를 새로고침하여 상태를 확인해주세요.")

def show_results_view():
    """연구 완료 결과 표시"""
    st.markdown("### ✅ 연구 완료!")
    st.success("AI가 생성한 상세 보고서가 준비되었습니다.")
    
    # 결과 조회
    status = ResearchAPI.get_status(st.session_state.session_id)
    
    if status and status.get('reportPaths'):
        st.markdown("#### 📄 생성된 보고서")
        
        # 파일 목록 표시
        report_paths = status['reportPaths']
        for report_info in report_paths:
            filename = report_info.get('filename', '')
            
            if filename.endswith('.pdf'):
                col1, col2 = st.columns([3, 1])
                
                with col1:
                    # 파일명을 더 읽기 쉽게 표시
                    display_name = filename.replace('_', ' ').replace('.pdf', '')
                    st.markdown(f"**📊 {display_name}**")
                
                with col2:
                    download_url = ResearchAPI.get_download_url(st.session_state.session_id, filename)
                    st.markdown(f"[📥 다운로드]({download_url})")
        
        # 통계 정보
        if status.get('result'):
            result = status['result']
            
            st.markdown("#### 📈 연구 통계")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                visited_urls = result.get('visitedUrls', [])
                st.metric("조사한 웹페이지", len(visited_urls))
            
            with col2:
                learnings = result.get('learnings', [])
                st.metric("생성된 인사이트", len(learnings))
            
            with col3:
                elapsed = int(time.time() - st.session_state.start_time)
                st.metric("총 소요시간", f"{elapsed // 60}분 {elapsed % 60}초")
    
    else:
        st.warning("보고서 파일을 찾을 수 없습니다. 잠시 후 다시 확인해주세요.")
    
    # 새 연구 시작 버튼
    st.markdown("---")
    if st.button("🔄 새 연구 시작", type="primary", use_container_width=True):
        st.session_state.session_id = None
        st.session_state.research_status = None
        st.rerun()

def show_error_view():
    """에러 발생 시 표시"""
    st.markdown("### ❌ 연구 중 오류 발생")
    
    error_message = st.session_state.get('error_message', 'Unknown error')
    st.error(f"오류 내용: {error_message}")
    
    st.info("잠시 후 다시 시도해주세요. 문제가 계속 발생하면 관리자에게 문의하세요.")
    
    # 새 연구 시작 버튼
    if st.button("🔄 새 연구 시작", type="primary"):
        st.session_state.session_id = None
        st.session_state.research_status = None
        st.rerun()

if __name__ == "__main__":
    main()