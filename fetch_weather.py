# -*- coding: utf-8 -*-
import urllib.request
import urllib.error
import json
from datetime import datetime
import os

ENV_FILE = r"C:\Users\PC\claude-workspace\.env"

def load_env():
    env = {}
    if not os.path.exists(ENV_FILE):
        return env
    with open(ENV_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip()
    return env

OUTPUT_FILE = r"C:\Users\PC\claude-workspace\weather.txt"
LAT = 37.5538
LON = 126.9026

def weather_desc(code):
    code = int(code)
    if code == 0:              return "맑음"
    elif code == 1:            return "대체로 맑음"
    elif code == 2:            return "부분 흐림"
    elif code == 3:            return "흐림"
    elif code in [45, 48]:     return "안개"
    elif code in [51,53,55]:   return "이슬비"
    elif code in [61,63,65]:   return "비"
    elif code in [66,67]:      return "얼어붙는 비"
    elif code in [71,73,75,77]: return "눈"
    elif code in [80,81,82]:   return "소나기"
    elif code in [85,86]:      return "눈 소나기"
    elif code in [95,96,99]:   return "천둥번개"
    else:                      return "알 수 없음"

def dust_grade(value, kind):
    if kind == "pm25":
        if value <= 15:  return "좋음"
        elif value <= 35: return "보통"
        elif value <= 75: return "나쁨"
        else:             return "매우나쁨"
    else:
        if value <= 30:   return "좋음"
        elif value <= 80:  return "보통"
        elif value <= 150: return "나쁨"
        else:              return "매우나쁨"

def dust_color(grade):
    return {"좋음": 3066993, "보통": 16776960, "나쁨": 15105570, "매우나쁨": 15158332}.get(grade, 9807270)

def send_discord(webhook_url, data):
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(
        webhook_url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "User-Agent": "DiscordBot (https://github.com, 1.0)"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            return res.status in (200, 204)
    except urllib.error.HTTPError as e:
        print(f"Discord 전송 실패 (HTTP {e.code}): {e.read().decode()}")
        return False

def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=15) as res:
        return json.loads(res.read().decode("utf-8"))

try:
    w_url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={LAT}&longitude={LON}"
        f"&current=temperature_2m,apparent_temperature,relative_humidity_2m,"
        f"precipitation,wind_speed_10m,weather_code"
        f"&timezone=Asia/Seoul"
    )
    a_url = (
        f"https://air-quality-api.open-meteo.com/v1/air-quality"
        f"?latitude={LAT}&longitude={LON}"
        f"&current=pm10,pm2_5,us_aqi"
        f"&timezone=Asia/Seoul"
    )

    w = fetch_json(w_url)["current"]
    a = fetch_json(a_url)["current"]

    temp     = w["temperature_2m"]
    feels    = w["apparent_temperature"]
    humidity = w["relative_humidity_2m"]
    precip   = w["precipitation"]
    wind     = w["wind_speed_10m"]
    desc     = weather_desc(w["weather_code"])

    pm25  = round(a["pm2_5"], 1)
    pm10  = round(a["pm10"], 1)
    aqi   = a["us_aqi"]
    g25   = dust_grade(pm25, "pm25")
    g10   = dust_grade(pm10, "pm10")

    now = datetime.now().strftime("%Y년 %m월 %d일 %H:%M")

    report = f"""========================================
  서울 마포구 날씨 리포트
  {now}
========================================

[ 날씨 ]
  상태     : {desc}
  기온     : {temp}°C  (체감 {feels}°C)
  습도     : {humidity}%
  강수량   : {precip}mm
  풍속     : {wind} km/h

[ 미세먼지 ]
  PM2.5   : {pm25} μg/m³  → {g25}
  PM10    : {pm10} μg/m³  → {g10}
  AQI(US) : {aqi}

[ 등급 기준 ]
  PM2.5 : 좋음(≤15) / 보통(≤35) / 나쁨(≤75) / 매우나쁨(>75)
  PM10  : 좋음(≤30) / 보통(≤80) / 나쁨(≤150) / 매우나쁨(>150)

  출처: Open-Meteo (api.open-meteo.com)
========================================

"""

    existing = ""
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
            existing = f.read()

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(report + existing)

    print(f"저장 완료 -> {OUTPUT_FILE}")
    print(f"기온: {temp}°C  PM2.5: {pm25} ({g25})  PM10: {pm10} ({g10})")

    # Discord Webhook 전송
    webhook_url = load_env().get("DISCORD_WEBHOOK_URL", "")
    if webhook_url:
        color = dust_color(g25)
        payload = {
            "username": "날씨봇",
            "avatar_url": "https://cdn-icons-png.flaticon.com/512/1116/1116453.png",
            "embeds": [{
                "title": f"서울 마포구 날씨  {now}",
                "color": color,
                "fields": [
                    {"name": "날씨",    "value": desc,                         "inline": True},
                    {"name": "기온",    "value": f"{temp}°C (체감 {feels}°C)", "inline": True},
                    {"name": "습도",    "value": f"{humidity}%",               "inline": True},
                    {"name": "PM2.5",  "value": f"{pm25} μg/m³  {g25}",       "inline": True},
                    {"name": "PM10",   "value": f"{pm10} μg/m³  {g10}",       "inline": True},
                    {"name": "AQI",    "value": str(aqi),                      "inline": True},
                ],
                "footer": {"text": "출처: Open-Meteo · api.open-meteo.com"}
            }]
        }
        ok = send_discord(webhook_url, payload)
        print("Discord 전송 완료" if ok else "Discord 전송 실패")
    else:
        print("Discord Webhook URL 미설정 (.env > DISCORD_WEBHOOK_URL)")

except Exception as e:
    error_log = OUTPUT_FILE.replace(".txt", "_error.log")
    msg = f"[{datetime.now().strftime('%Y-%m-%d %H:%M')}] 오류: {e}\n"
    with open(error_log, "a", encoding="utf-8") as f:
        f.write(msg)
    print(f"오류 발생: {e}")
    raise SystemExit(1)
