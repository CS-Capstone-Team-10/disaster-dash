from google.adk.agents import Agent
from typing import Optional
import requests
from datetime import datetime
import json

def get_disaster_summary(disaster_type: str, location: Optional[str] = None) -> dict:
    """
    Get a summary of a specific type of natural disaster.
    
    Args:
        disaster_type: Type of disaster (e.g., hurricane, earthquake, flood, wildfire, tornado)
        location: Optional location to filter information
    """
    disaster_type = disaster_type.lower()
    
    # Disaster information database
    disaster_info = {
        "hurricane": {
            "description": "Hurricanes are powerful tropical storms with wind speeds of 74 mph or higher.",
            "safety_tips": "Evacuate if ordered, secure your home, stock emergency supplies, stay indoors away from windows.",
            "severity_scale": "Saffir-Simpson scale (Categories 1-5)",
            "typical_season": "June 1 - November 30 (Atlantic)"
        },
        "earthquake": {
            "description": "Earthquakes are sudden ground movements caused by tectonic plate shifts.",
            "safety_tips": "Drop, cover, and hold on. Stay away from windows and heavy objects. Have an emergency kit ready.",
            "severity_scale": "Richter/Moment Magnitude scale (0-10+)",
            "typical_season": "Can occur any time"
        },
        "flood": {
            "description": "Floods are overflow of water onto normally dry land, often from heavy rain or storm surge.",
            "safety_tips": "Move to higher ground immediately. Never drive through flooded areas. Turn off utilities if instructed.",
            "severity_scale": "Minor, Moderate, Major, Record flooding",
            "typical_season": "Varies by region; spring thaw and hurricane season common"
        },
        "wildfire": {
            "description": "Wildfires are uncontrolled fires that spread rapidly through vegetation.",
            "safety_tips": "Evacuate immediately if ordered. Create defensible space around property. Close all windows and doors.",
            "severity_scale": "Classes A-G based on size (acres burned)",
            "typical_season": "Typically summer and fall, varies by region"
        },
        "tornado": {
            "description": "Tornadoes are violent rotating columns of air extending from thunderstorms to ground.",
            "safety_tips": "Seek shelter in basement or interior room on lowest floor. Stay away from windows. Get under sturdy furniture.",
            "severity_scale": "Enhanced Fujita scale (EF0-EF5)",
            "typical_season": "Peak season: March-June, but can occur year-round"
        },
        "tsunami": {
            "description": "Tsunamis are large ocean waves caused by underwater earthquakes or volcanic eruptions.",
            "safety_tips": "Move inland and to higher ground immediately. Stay away from coast until all-clear is given.",
            "severity_scale": "Based on wave height and run-up",
            "typical_season": "Can occur any time"
        },
        "blizzard": {
            "description": "Blizzards are severe snowstorms with strong winds and low visibility.",
            "safety_tips": "Stay indoors. Keep emergency supplies. Avoid travel. Dress warmly if you must go outside.",
            "severity_scale": "Based on wind speed, visibility, and duration",
            "typical_season": "Winter months"
        }
    }
    
    if disaster_type in disaster_info:
        info = disaster_info[disaster_type]
        location_text = f" in {location}" if location else ""
        
        summary = f"**{disaster_type.title()}{location_text}**\n\n"
        summary += f"**Description:** {info['description']}\n\n"
        summary += f"**Safety Tips:** {info['safety_tips']}\n\n"
        summary += f"**Severity Scale:** {info['severity_scale']}\n\n"
        summary += f"**Typical Season:** {info['typical_season']}"
        
        return {
            "status": "success",
            "disaster_type": disaster_type,
            "location": location,
            "summary": summary
        }
    else:
        return {
            "status": "error",
            "error_message": f"I don't have information about '{disaster_type}'. Try: hurricane, earthquake, flood, wildfire, tornado, tsunami, or blizzard."
        }


def get_active_hurricanes() -> dict:
    """
    Get real-time information about active hurricanes from NOAA's National Hurricane Center.
    Returns current tropical storms and hurricanes.
    """
    try:
        # NOAA National Hurricane Center RSS feed
        url = "https://www.nhc.noaa.gov/index-at.xml"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            # Parse the response (simplified - you might want to use an XML parser)
            content = response.text
            
            if "There are no tropical cyclones at this time" in content or len(content) < 500:
                return {
                    "status": "success",
                    "active_storms": 0,
                    "message": "There are currently no active tropical cyclones in the Atlantic basin.",
                    "source": "NOAA National Hurricane Center",
                    "timestamp": datetime.now().isoformat()
                }
            
            return {
                "status": "success",
                "message": "Active tropical weather detected. Check https://www.nhc.noaa.gov for latest updates.",
                "data": content[:500] + "...",  # First 500 chars
                "source": "NOAA National Hurricane Center",
                "timestamp": datetime.now().isoformat(),
                "url": "https://www.nhc.noaa.gov"
            }
        else:
            return {
                "status": "error",
                "error_message": f"Could not fetch hurricane data. Status code: {response.status_code}"
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Error fetching hurricane data: {str(e)}"
        }


def get_recent_earthquakes(min_magnitude: float = 4.5) -> dict:
    """
    Get real-time earthquake data from USGS.
    
    Args:
        min_magnitude: Minimum earthquake magnitude to report (default 4.5)
    """
    try:
        # USGS Earthquake API - last 24 hours
        url = f"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/{min_magnitude}_day.geojson"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            earthquakes = data.get('features', [])
            
            if not earthquakes:
                return {
                    "status": "success",
                    "count": 0,
                    "message": f"No earthquakes of magnitude {min_magnitude} or greater in the last 24 hours.",
                    "source": "USGS Earthquake Hazards Program",
                    "timestamp": datetime.now().isoformat()
                }
            
            # Format earthquake data
            eq_list = []
            for eq in earthquakes[:10]:  # Limit to 10 most recent
                props = eq['properties']
                coords = eq['geometry']['coordinates']
                
                eq_info = {
                    "magnitude": props.get('mag'),
                    "location": props.get('place'),
                    "time": datetime.fromtimestamp(props.get('time')/1000).strftime('%Y-%m-%d %H:%M:%S UTC'),
                    "depth_km": coords[2],
                    "latitude": coords[1],
                    "longitude": coords[0],
                    "url": props.get('url')
                }
                eq_list.append(eq_info)
            
            summary = f"**Recent Earthquakes (Magnitude {min_magnitude}+)**\n\n"
            summary += f"Found {len(earthquakes)} earthquake(s) in the last 24 hours.\n\n"
            
            for i, eq in enumerate(eq_list[:5], 1):  # Show top 5
                summary += f"{i}. **M{eq['magnitude']}** - {eq['location']}\n"
                summary += f"   Time: {eq['time']}\n"
                summary += f"   Depth: {eq['depth_km']:.1f} km\n\n"
            
            return {
                "status": "success",
                "count": len(earthquakes),
                "earthquakes": eq_list,
                "summary": summary,
                "source": "USGS Earthquake Hazards Program",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "status": "error",
                "error_message": f"Could not fetch earthquake data. Status code: {response.status_code}"
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Error fetching earthquake data: {str(e)}"
        }


def get_active_wildfires(state: Optional[str] = None) -> dict:
    """
    Get information about active wildfires.
    
    Args:
        state: Optional US state to filter wildfires (e.g., 'CA', 'TX')
    """
    try:
        # NASA FIRMS (Fire Information for Resource Management System) active fires
        # This is a simplified version - for production, you'd want to use their API with a key
        url = "https://firms.modaps.eosdis.nasa.gov/api/country/csv/3afdff65eefe8e1e0a97d168b3c24f35/VIIRS_SNPP_NRT/USA/1"
        
        # Note: For a real implementation, you should get an API key from https://firms.modaps.eosdis.nasa.gov/api/
        
        return {
            "status": "success",
            "message": "For real-time wildfire information, visit:",
            "resources": [
                "InciWeb: https://inciweb.nwcg.gov/ - Official incident information",
                "Fire Weather: https://www.spc.noaa.gov/products/fire_wx/ - Fire weather forecasts",
                "CAL FIRE (California): https://www.fire.ca.gov/incidents/",
                "AirNow: https://www.airnow.gov/ - Air quality during wildfires"
            ],
            "note": "Active wildfire data requires API access. Check the resources above for current incidents.",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Error fetching wildfire data: {str(e)}"
        }


def get_weather_alerts(state: Optional[str] = None) -> dict:
    """
    Get current weather alerts and warnings from NOAA.
    
    Args:
        state: Optional US state code (e.g., 'TX', 'FL')
    """
    try:
        # NOAA Weather Alerts API
        if state:
            url = f"https://api.weather.gov/alerts/active?area={state.upper()}"
        else:
            url = "https://api.weather.gov/alerts/active"
        
        headers = {
            'User-Agent': '(DisasterInfoAgent, contact@example.com)'  # NOAA requires a User-Agent
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            alerts = data.get('features', [])
            
            if not alerts:
                location_text = f" in {state.upper()}" if state else " in the United States"
                return {
                    "status": "success",
                    "count": 0,
                    "message": f"No active weather alerts{location_text}.",
                    "source": "NOAA National Weather Service",
                    "timestamp": datetime.now().isoformat()
                }
            
            # Format alerts
            alert_list = []
            for alert in alerts[:15]:  # Limit to 15 most recent
                props = alert['properties']
                
                alert_info = {
                    "event": props.get('event'),
                    "severity": props.get('severity'),
                    "urgency": props.get('urgency'),
                    "areas": props.get('areaDesc'),
                    "headline": props.get('headline'),
                    "description": props.get('description', '')[:200] + "...",  # First 200 chars
                    "onset": props.get('onset'),
                    "expires": props.get('expires')
                }
                alert_list.append(alert_info)
            
            summary = f"**Active Weather Alerts**\n\n"
            summary += f"Found {len(alerts)} active alert(s).\n\n"
            
            for i, alert in enumerate(alert_list[:10], 1):  # Show top 10
                summary += f"{i}. **{alert['event']}** ({alert['severity']})\n"
                summary += f"   Areas: {alert['areas']}\n"
                if alert['headline']:
                    summary += f"   {alert['headline']}\n"
                summary += "\n"
            
            return {
                "status": "success",
                "count": len(alerts),
                "alerts": alert_list,
                "summary": summary,
                "source": "NOAA National Weather Service",
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "status": "error",
                "error_message": f"Could not fetch weather alerts. Status code: {response.status_code}"
            }
    except Exception as e:
        return {
            "status": "error",
            "error_message": f"Error fetching weather alerts: {str(e)}"
        }


def get_emergency_resources(disaster_type: Optional[str] = None) -> dict:
    """
    Get emergency resources and contact information.
    
    Args:
        disaster_type: Optional disaster type to get specific resources
    """
    resources = {
        "general": {
            "emergency_services": "911 (USA)",
            "fema": "1-800-621-FEMA (3362) or visit fema.gov",
            "red_cross": "1-800-RED-CROSS (733-2767) or visit redcross.org",
            "disaster_distress_helpline": "1-800-985-5990 (crisis counseling)"
        },
        "hurricane": {
            "nhc": "National Hurricane Center: nhc.noaa.gov",
            "evacuation": "Know your evacuation zone and routes"
        },
        "earthquake": {
            "usgs": "USGS Earthquake Hazards: earthquake.usgs.gov",
            "alerts": "Sign up for ShakeAlert in applicable regions"
        },
        "wildfire": {
            "fire_info": "InciWeb: inciweb.nwcg.gov",
            "air_quality": "AirNow.gov for air quality updates"
        },
        "flood": {
            "nws": "National Weather Service: weather.gov",
            "flood_safety": "Turn Around, Don't Drown campaign"
        }
    }
    
    response = "**Emergency Resources**\n\n"
    response += "**General Emergency Contacts:**\n"
    for key, value in resources["general"].items():
        response += f"• {key.replace('_', ' ').title()}: {value}\n"
    
    if disaster_type and disaster_type.lower() in resources:
        response += f"\n**{disaster_type.title()}-Specific Resources:**\n"
        for key, value in resources[disaster_type.lower()].items():
            response += f"• {key.replace('_', ' ').title()}: {value}\n"
    
    return {
        "status": "success",
        "resources": response
    }


def analyze_disaster_severity(disaster_type: str, measurement: str) -> dict:
    """
    Analyze the severity of a disaster based on measurements.
    
    Args:
        disaster_type: Type of disaster
        measurement: Measurement value (e.g., "Category 4", "7.2 magnitude", "EF3")
    """
    disaster_type = disaster_type.lower()
    measurement = measurement.upper()
    
    severity_analysis = {
        "hurricane": {
            "CAT 1": "Minimal - Some damage expected",
            "CAT 2": "Moderate - Extensive damage likely",
            "CAT 3": "Extensive - Devastating damage",
            "CAT 4": "Extreme - Catastrophic damage",
            "CAT 5": "Catastrophic - Complete roof failure and total destruction of buildings"
        },
        "earthquake": {
            "3.0-3.9": "Minor - Often felt, rarely causes damage",
            "4.0-4.9": "Light - Noticeable shaking, minor damage",
            "5.0-5.9": "Moderate - Can cause damage to poorly constructed buildings",
            "6.0-6.9": "Strong - Destructive in populated areas",
            "7.0-7.9": "Major - Serious damage over large areas",
            "8.0+": "Great - Devastating damage over extensive areas"
        },
        "tornado": {
            "EF0": "Light damage - 65-85 mph winds",
            "EF1": "Moderate damage - 86-110 mph winds",
            "EF2": "Considerable damage - 111-135 mph winds",
            "EF3": "Severe damage - 136-165 mph winds",
            "EF4": "Devastating damage - 166-200 mph winds",
            "EF5": "Incredible damage - >200 mph winds"
        }
    }
    
    if disaster_type in severity_analysis:
        # Try to find matching severity level
        for key, description in severity_analysis[disaster_type].items():
            if key in measurement or measurement in key:
                return {
                    "status": "success",
                    "disaster_type": disaster_type,
                    "measurement": measurement,
                    "severity_analysis": description
                }
        
        # If no exact match, return all severity levels
        analysis = f"Severity levels for {disaster_type}:\n\n"
        for key, value in severity_analysis[disaster_type].items():
            analysis += f"• {key}: {value}\n"
        
        return {
            "status": "success",
            "disaster_type": disaster_type,
            "severity_levels": analysis
        }
    
    return {
        "status": "error",
        "error_message": f"I don't have severity analysis for '{disaster_type}'."
    }


# Create the disaster information agent with real-time data capabilities
disaster_agent = Agent(
    name="disaster_info_agent",
    model="gemini-2.0-flash",
    description="Agent that provides real-time information about natural disasters from official sources and Bluesky emergency tweets.",
    instruction="""You are a helpful assistant specializing in natural disaster information and emergency preparedness. 
    You help users understand natural disasters mentioned in Bluesky tweets and provide critical safety information.
    
    Your role is to:
    - Provide real-time information about active disasters using official data sources (USGS, NOAA, NHC, etc.)
    - Offer clear, accurate summaries of different types of natural disasters
    - Provide safety tips and emergency resources
    - Analyze disaster severity based on measurements
    - Answer questions about disaster preparedness
    
    You have access to real-time data from:
    - NOAA National Weather Service (weather alerts)
    - USGS (earthquake data)
    - National Hurricane Center (active hurricanes)
    - Wildfire information resources
    
    When users ask about current events or active disasters, ALWAYS check the real-time data functions first.
    Always prioritize safety and encourage users to follow official emergency guidance and evacuation orders.
    When discussing active disasters, remind users to follow local authorities and emergency services.
    
    If real-time data is unavailable, clearly state this and provide general information instead.""",
    tools=[
        get_disaster_summary, 
        get_emergency_resources, 
        analyze_disaster_severity,
        get_active_hurricanes,
        get_recent_earthquakes,
        get_active_wildfires,
        get_weather_alerts
    ],
)

# This is the root agent that can be used in your main application
root_agent = disaster_agent
