# test-api.ps1
$base = 'http://localhost:5000'
$endpoints = @('/api','/api/donations','/api/ngo-requests','/api/inventory','/api/users')

foreach ($ep in $endpoints) {
  $url = "$base$ep"
  Write-Host "GET $url"
  try {
    $json = Invoke-RestMethod -Uri $url -Headers @{ Accept = 'application/json' } -Method Get -TimeoutSec 10
    Write-Host "Status: 200 (parsed JSON)"
    $json | ConvertTo-Json -Depth 5 | Write-Host
  } catch {
    try {
      $resp = Invoke-WebRequest -Uri $url -Headers @{ Accept = 'application/json' } -Method Get -TimeoutSec 10 -ErrorAction Stop
      $status = $resp.StatusCode
      $ct = $resp.Headers['Content-Type']
      Write-Host "Status: $status; Content-Type: $ct"
      $resp.Content | Write-Host
    } catch {
      Write-Host "Request failed: $($_.Exception.Message)"
    }
  }
  Write-Host "`n---`n"
}
