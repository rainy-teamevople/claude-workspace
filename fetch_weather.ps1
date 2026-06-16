# Seoul Mapo-gu Weather + Air Quality Script
# Open-Meteo API (no API key required)

$OutputFile = "C:\Users\PC\claude-workspace\weather.txt"
$Lat = 37.5538
$Lon = 126.9026

function Get-WeatherDesc($code) {
    $c = [int]$code
    if ($c -eq 0)                          { return "맑음" }
    elseif ($c -eq 1)                      { return "대체로 맑음" }
    elseif ($c -eq 2)                      { return "부분 흐림" }
    elseif ($c -eq 3)                      { return "흐림" }
    elseif ($c -in @(45,48))               { return "안개" }
    elseif ($c -in @(51,53,55))            { return "이슬비" }
    elseif ($c -in @(61,63,65))            { return "비" }
    elseif ($c -in @(66,67))               { return "얼어붙는 비" }
    elseif ($c -in @(71,73,75,77))         { return "눈" }
    elseif ($c -in @(80,81,82))            { return "소나기" }
    elseif ($c -in @(85,86))              { return "눈 소나기" }
    elseif ($c -in @(95,96,99))            { return "천둥번개" }
    else                                   { return "알 수 없음" }
}

function Get-DustGrade($value, $type) {
    if ($type -eq "pm25") {
        if ($value -le 15)  { return "좋음" }
        elseif ($value -le 35)  { return "보통" }
        elseif ($value -le 75)  { return "나쁨" }
        else                     { return "매우나쁨" }
    } else {
        if ($value -le 30)   { return "좋음" }
        elseif ($value -le 80)   { return "보통" }
        elseif ($value -le 150)  { return "나쁨" }
        else                      { return "매우나쁨" }
    }
}

try {
    $wUrl = "https://api.open-meteo.com/v1/forecast?latitude=${Lat}&longitude=${Lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=Asia/Seoul"
    $aUrl = "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${Lat}&longitude=${Lon}&current=pm10,pm2_5,us_aqi&timezone=Asia/Seoul"

    $w = Invoke-RestMethod -Uri $wUrl -TimeoutSec 15
    $a = Invoke-RestMethod -Uri $aUrl -TimeoutSec 15

    $temp     = $w.current.temperature_2m
    $feels    = $w.current.apparent_temperature
    $humidity = $w.current.relative_humidity_2m
    $precip   = $w.current.precipitation
    $wind     = $w.current.wind_speed_10m
    $desc     = Get-WeatherDesc $w.current.weather_code

    $pm25  = [math]::Round($a.current.pm2_5, 1)
    $pm10  = [math]::Round($a.current.pm10, 1)
    $aqi   = $a.current.us_aqi
    $g25   = Get-DustGrade $pm25 "pm25"
    $g10   = Get-DustGrade $pm10 "pm10"

    $now = Get-Date -Format "yyyy년 MM월 dd일 HH:mm"

    $lines = @(
        "========================================"
        "  서울 마포구 날씨 리포트"
        "  $now"
        "========================================"
        ""
        "[ 날씨 ]"
        "  상태     : $desc"
        "  기온     : ${temp}C  (체감 ${feels}C)"
        "  습도     : ${humidity}%"
        "  강수량   : ${precip}mm"
        "  풍속     : ${wind} km/h"
        ""
        "[ 미세먼지 ]"
        "  PM2.5   : ${pm25} ug/m3  -> $g25"
        "  PM10    : ${pm10} ug/m3  -> $g10"
        "  AQI(US) : $aqi"
        ""
        "[ 등급 기준 ]"
        "  PM2.5 : 좋음(<=15) / 보통(<=35) / 나쁨(<=75) / 매우나쁨(>75)"
        "  PM10  : 좋음(<=30) / 보통(<=80) / 나쁨(<=150) / 매우나쁨(>150)"
        ""
        "  출처: Open-Meteo (api.open-meteo.com)"
        "========================================"
        ""
    )

    $report = $lines -join "`r`n"

    $existing = ""
    if (Test-Path $OutputFile) {
        $existing = Get-Content $OutputFile -Raw -Encoding utf8
    }

    [System.IO.File]::WriteAllText($OutputFile, ($report + $existing), [System.Text.Encoding]::UTF8)

    Write-Host "저장 완료 -> $OutputFile"
    Write-Host "기온: ${temp}C  PM2.5: ${pm25} ($g25)  PM10: ${pm10} ($g10)"

} catch {
    $errLog = $OutputFile -replace '\.txt$','_error.log'
    $msg = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm')] 오류: $_"
    [System.IO.File]::AppendAllText($errLog, ($msg + "`r`n"), [System.Text.Encoding]::UTF8)
    Write-Host "오류 발생: $_"
    exit 1
}
