# Amplitude Event Code 목록

## 주최자 (Host) - 모임 생성

| Event Code                      | 개발용 노트                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| `host_name_input`               | /create 화면 모임장이름 input 포커스 아웃 시 (src/features/meet-create/ui/MeetCreatePage.tsx) |
| `host_meeting_name_input`       | /create 화면 모임명 input 포커스 아웃 시. is_autofilled: true/false (랜덤 문구 사용 여부)     |
| `host_date_select`              | /date 화면에서 캘린더 날짜 범위 선택 완료 시 (ReactDatepickerAdapter.tsx의 handleMouseUp)     |
| `host_create_meeting_cta_click` | /date 화면 하단 [모임 만들기] 버튼 클릭 (src/features/meet-create-date/ui/DateSelectPage.tsx) |
| `host_option_modal_click`       | 모임 만들기 완료 후 바텀시트에서 [가능해요] 버튼 클릭. selection: all_available               |
| `host_direct_vote_cta_click`    | 모임 만들기 완료 후 바텀시트에서 [직접 투표하기] 버튼 클릭. selection: direct_vote            |

---

## 참여자 (Voter) - 메인 화면

| Event Code                   | 개발용 노트                                                                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `voter_view_main`            | /meet/${meetingId} 페이지 최초 진입 시 useEffect로 1회 발생. is_voted: true/false (투표 전/후 구분)                                                 |
| `voter_month_move_btn_click` | 캘린더 상단 `<` `>` 화살표 버튼 클릭 (src/features/vote-results-calendar/ui/ReactDatepicker.tsx의 decreaseMonth/increaseMonth)                      |
| `voter_filter_click`         | "참여자 보기" 드롭다운 내부 참여자 이름 Chip 클릭 (src/widgets/vote-result/ui/VoteResultDataView.tsx의 onSelectParticipant). filter_type: name_chip |
| `voter_date_cell_click`      | 캘린더에서 특정 날짜 셀 클릭 (ReactDatepicker.tsx renderDayContents 내 onClick)                                                                     |
| `voter_view_voter_count`     | 날짜 셀 클릭 후 상세 패널 "N명이 가능해요" 노출 시 (src/features/vote-results-calendar/ui/VoteResultsShell.tsx). count: voter number                |
| `voter_dropdown_click`       | "참여자 보기" 드롭다운 헤더 클릭하여 열기/닫기 (src/shared/ui/dropdown/Dropdown.tsx handleToggle)                                                   |

---

## 참여자 (Voter) - 투표 수정 (Vote: Edit)

| Event Code                             | 개발용 노트                                                                                                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `voter_vote_edit_cta_click`            | /meet/${meetingId} 메인 화면 하단 [투표 수정하기] 버튼 클릭                                                                                                        |
| `voter_name_input_edit`                | /meet/${meetingId}/edit 화면에서 이름 input 포커스 아웃 시 (src/features/participant-edit-name/ui/ParticipantEditNamePage.tsx)                                     |
| `voter_name_input_completed_cta_click` | /meet/${meetingId}/edit 화면 하단 [일정 수정하기] 버튼 클릭 (ParticipantEditNamePage.tsx handleSubmit)                                                             |
| `voter_date_edit`                      | /meet/${meetingId}/edit/date 화면 캘린더에서 날짜 선택 시 (src/features/participant-edit-date/ui/ParticipantEditDatePage.tsx). vote_type: selective / all_disabled |
| `voter_date_edit_confirm_cta_click`    | /meet/${meetingId}/edit/date 화면 하단 [투표하기] 버튼 클릭 (ParticipantEditDatePage.tsx handleSubmit)                                                             |
| `voter_edit_completed_cta_click`       | 투표 수정 완료 SuccessBottomSheet에서 [확인] 버튼 클릭 (src/shared/ui/bottom-sheet/SuccessBottomSheet.tsx onConfirm)                                               |

---

## 참여자 (Voter) - 투표 참여 (Vote: Process)

| Event Code                       | 개발용 노트                                                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `voter_vote_start_cta_click`     | /meet/${meetingId} 메인 화면 하단 [투표하기] 버튼 클릭 (최초 투표하기 시작 버튼)                                                                                               |
| `voter_name_input`               | /meet/${meetingId}/register 화면에서 이름 input 포커스 아웃 시 (src/features/participant-register-name/ui/ParticipantRegisterNamePage.tsx)                                     |
| `voter_name_completed_cta_click` | /meet/${meetingId}/register 화면 하단 [일정 선택하기] 버튼 클릭 (ParticipantRegisterNamePage.tsx handleSubmit)                                                                 |
| `voter_date_vote`                | /meet/${meetingId}/register/date 화면 캘린더에서 날짜 선택 시 (src/features/participant-register-date/ui/ParticipantRegisterDatePage.tsx). vote_type: selective / all_disabled |
| `voter_vote_cta_click`           | /meet/${meetingId}/register/date 화면 하단 [투표하기] 버튼 클릭 (ParticipantRegisterDatePage.tsx handleSubmit)                                                                 |
| `voter_vote_completed_cta_click` | 투표 완료 SuccessBottomSheet에서 [확인] 버튼 클릭 (SuccessBottomSheet.tsx onConfirm)                                                                                           |

---

## 공통 - 공유 (Common: Share)

| Event Code               | 개발용 노트                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `modal_share_sheet_open` | 상단 공유 아이콘(ic_other_share) 또는 모임 생성 완료 시 LinkShareBottomSheet 오픈. entry_point: host_create / main_top (모달/상단 아이콘)         |
| `modal_link_copy_click`  | LinkShareBottomSheet 내 [복사] Chip 버튼 클릭 (src/shared/ui/bottom-sheet/LinkShareBottomSheet.tsx handleCopy)                                    |
| `modal_x_btn_click`      | BottomSheet 우측 상단 X(ic_menu_close) 버튼 클릭 (src/shared/ui/bottom-sheet/BottomSheet.tsx onClose)                                             |
| `os_share_cta_click`     | LinkShareBottomSheet 내 [링크 공유하기] 버튼 클릭 → OS 공유 시트 호출 (LinkShareBottomSheet.tsx handleShare). entry_point: host_create / main_top |
