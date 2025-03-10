# Changelog

## 2023-06-22 12:34
- Note: Conversations are not currently being saved

## 2025-03-05 20:21
- Added chat rename functionality in the sidebar
- Users can now click on an edit icon next to each chat to rename it
- Added save and cancel buttons during editing
- Keyboard support for Enter (save) and Escape (cancel) keys during editing

## 2023-07-11 14:30
- Implemented conversation persistence using localStorage
- Added Save button to explicitly save conversations
- Chats are now automatically loaded when returning to the application
- Fixed issue where switching between chats didn't properly display chat contents

## 2023-05-14 15:28
- Fixed flickering loop when deleting chat conversations
- Improved state management for chat deletion to prevent UI glitches
- Added proper handling of empty chats array after deleting all chats