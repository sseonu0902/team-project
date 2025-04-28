# Node.js 프로세스 종료 스크립트
Write-Host "Node.js 프로세스를 종료합니다..."
taskkill /F /IM node.exe
Write-Host "모든 Node.js 프로세스가 종료되었습니다." 